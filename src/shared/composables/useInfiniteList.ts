import { onBeforeUnmount, ref, watch } from 'vue'
import type { Ref } from 'vue'
import { i18n } from '@app/plugins/i18n'

export interface InfiniteListPage<TItem> {
  items: TItem[]
  hasMore: boolean
  total?: number
}

export interface InfiniteListParams {
  page: number
  perPage: number
  search: string
}

export type InfiniteListLoader<TItem> = (
  params: InfiniteListParams,
) => Promise<InfiniteListPage<TItem>>

export function useInfiniteList<TItem>(
  loadPage: InfiniteListLoader<TItem>,
  options: {
    perPage?: number
    initialSearch?: string
  } = {},
) {
  const items = ref<TItem[]>([]) as Ref<TItem[]>
  const search = ref(options.initialSearch ?? '')
  const page = ref(0)
  const total = ref(0)
  const hasMore = ref(true)
  const isLoading = ref(false)
  const isLoadingMore = ref(false)
  const error = ref('')
  const sentinelRef = ref<HTMLElement | null>(null)
  const scrollRootRef = ref<HTMLElement | null>(null)
  const perPage = options.perPage ?? 10
  let observer: IntersectionObserver | undefined
  let requestId = 0

  async function loadInitial(nextSearch = search.value): Promise<void> {
    const currentRequestId = requestId + 1
    requestId = currentRequestId
    search.value = nextSearch
    page.value = 0
    total.value = 0
    items.value = []
    hasMore.value = true
    error.value = ''
    isLoading.value = true

    try {
      const response = await loadPage({ page: 1, perPage, search: search.value })

      if (currentRequestId !== requestId) {
        return
      }

      page.value = 1
      items.value = response.items
      total.value = response.total ?? response.items.length
      hasMore.value = response.hasMore
    } catch (loadError) {
      if (currentRequestId === requestId) {
        error.value = loadError instanceof Error ? loadError.message : i18n.global.t('api.errors.loadItems')
      }
    } finally {
      if (currentRequestId === requestId) {
        isLoading.value = false
      }
    }
  }

  async function loadMore(): Promise<void> {
    if (isLoading.value || isLoadingMore.value || !hasMore.value) {
      return
    }

    const currentRequestId = requestId
    const nextPage = page.value + 1
    isLoadingMore.value = true
    error.value = ''

    try {
      const response = await loadPage({ page: nextPage, perPage, search: search.value })

      if (currentRequestId !== requestId) {
        return
      }

      page.value = nextPage
      items.value = [...items.value, ...response.items]
      total.value = response.total ?? items.value.length
      hasMore.value = response.hasMore
    } catch (loadError) {
      if (currentRequestId === requestId) {
        error.value = loadError instanceof Error ? loadError.message : i18n.global.t('api.errors.loadMoreItems')
      }
    } finally {
      if (currentRequestId === requestId) {
        isLoadingMore.value = false
      }
    }
  }

  watch(
    [sentinelRef, scrollRootRef],
    () => {
      observer?.disconnect()

      if (!sentinelRef.value) {
        return
      }

      observer = new IntersectionObserver(
        (entries) => {
          if (entries.some((entry) => entry.isIntersecting)) {
            void loadMore()
          }
        },
        {
          root: scrollRootRef.value,
          rootMargin: '120px',
        },
      )
      observer.observe(sentinelRef.value)
    },
    { flush: 'post' },
  )

  onBeforeUnmount(() => {
    observer?.disconnect()
  })

  return {
    items,
    search,
    page,
    total,
    hasMore,
    isLoading,
    isLoadingMore,
    error,
    sentinelRef,
    scrollRootRef,
    loadInitial,
    loadMore,
  }
}
