import { ref } from 'vue'
import { defineStore } from 'pinia'
import { supabase } from '@/supabase'

export const useLinkStore = defineStore('linkStore', () => {
  const isLoading = ref(false)
  const links = ref([])
  const isOnlyFavorite = ref(false)
  const isPopular = ref(false)
  const totalLinks = ref(0)
  const hasMore = ref(true)
  const offset = ref(0)
  const LIMIT = 4

  const loadLinks = async (resetPages = false, resetFilters = false) => {
    isLoading.value = false

    if (resetPages) {
      offset.value = 0
      links.value = []
      hasMore.value = true
    }

    if (resetFilters) {
      isOnlyFavorite.value = false
      isPopular.value = false
    }

    try {
      isLoading.value = true
      let query = supabase
        .from('links')
        .select(
          'id, name, url, description, is_favorite, preview_image, click_count, category (id, name)',
          { count: 'exact' },
        )
        .range(offset.value, offset.value + LIMIT - 1)

      if (isOnlyFavorite.value) query = query.eq('is_favorite', true)
      if (isPopular.value) {
        query = query.order('click_count', { ascending: false })
      } else {
        query = query.order('created_at', { ascending: false })
      }
      const { data, error, count } = await query
      totalLinks.value = count
      offset.value += data.length
      console.log(count)
      if (error) throw error
      links.value.push(...data)
      hasMore.value = offset.value < totalLinks.value
    } catch (err) {
      console.log(err)
    } finally {
      isLoading.value = false
    }
  }

  const toggleIsFavorite = async (id) => {
    const index = links.value.findIndex((item) => item.id === id)

    if (index !== -1) {
      const newFavorite = !links.value[index].is_favorite

      const { error } = await supabase
        .from('links')
        .update({ is_favorite: newFavorite })
        .eq('id', id)

      if (error) throw error
      links.value[index].is_favorite = newFavorite
    }
  }

  const addClickCount = async (id) => {
    const index = links.value.findIndex((item) => item.id === id)

    if (index !== -1) {
      const newClickCount = links.value[index].click_count + 1

      const { error } = await supabase
        .from('links')
        .update({ click_count: newClickCount })
        .eq('id', id)

      if (error) throw error
      links.value[index].click_count = newClickCount
    }
  }

  const removeLink = async (id) => {
    const { error } = await supabase.from('links').delete().eq('id', id)
    if (error) throw error
    links.value = links.value.filter((item) => item.id !== id)
  }

  return {
    isLoading,
    isOnlyFavorite,
    isPopular,
    hasMore,
    links,
    loadLinks,
    toggleIsFavorite,
    addClickCount,
    removeLink,
  }
})
