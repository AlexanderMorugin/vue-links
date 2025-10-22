import { ref } from 'vue'
import { defineStore } from 'pinia'
import { supabase } from '@/supabase'

export const useLinkStore = defineStore('linkStore', () => {
  const isLoading = ref(false)
  const links = ref(null)

  const loadLinks = async () => {
    isLoading.value = true

    const { data, error } = await supabase
      .from('links')
      .select(
        'id, name, url, description, is_favorite, preview_image, click_count, category (id, name)',
      )
      .order('created_at', { ascending: false })

    if (error) throw error
    links.value = data
    isLoading.value = false
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

  return { isLoading, links, loadLinks, toggleIsFavorite, addClickCount, removeLink }
})
