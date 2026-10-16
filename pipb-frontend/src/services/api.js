export const API_URL = 'http://127.0.0.1:8000/api'

/*
|--------------------------------------------------------------------------
| AUTHENTICATION
|--------------------------------------------------------------------------
*/

export const login = async (email, password) => {
  const response = await fetch(`${API_URL}/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify({ email, password }),
  })

  const data = await response.json()

  if (!response.ok) {
    throw new Error(data.message || 'Login gagal')
  }

  return data
}

export const register = async (
  name,
  email,
  password,
  passwordConfirmation
) => {
  const response = await fetch(`${API_URL}/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify({
      name,
      email,
      password,
      password_confirmation: passwordConfirmation,
    }),
  })

  const data = await response.json()

  if (!response.ok) {
    const validationErrors = data.errors
      ? Object.values(data.errors).flat().join(' ')
      : ''

    throw new Error(
      validationErrors || data.message || 'Registrasi gagal'
    )
  }

  return data
}

export const logout = async () => {
  const token = localStorage.getItem('token')

  const response = await fetch(`${API_URL}/logout`, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      Authorization: `Bearer ${token}`,
    },
  })

  const data = await response.json()

  if (!response.ok) {
    throw new Error(data.message || 'Logout gagal')
  }

  return data
}

/*
|--------------------------------------------------------------------------
| NOTIFICATIONS
|--------------------------------------------------------------------------
*/

export const getNotifications = async () => {
  const token = localStorage.getItem('token')

  const response = await fetch(`${API_URL}/notifications`, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      Authorization: `Bearer ${token}`,
    },
  })

  const data = await response.json()

  if (!response.ok) {
    throw new Error(
      data.message || 'Gagal mengambil notifikasi'
    )
  }

  return data
}

export const markNotificationAsRead = async (notificationId) => {
  const token = localStorage.getItem('token')

  const response = await fetch(
    `${API_URL}/notifications/${notificationId}/read`,
    {
      method: 'PUT',
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${token}`,
      },
    }
  )

  const data = await response.json()

  if (!response.ok) {
    throw new Error(
      data.message ||
        'Gagal menandai notifikasi sebagai dibaca'
    )
  }

  return data
}

/*
|--------------------------------------------------------------------------
| PUBLIC PRODUCTS
|--------------------------------------------------------------------------
*/

export const getProducts = async () => {
  const response = await fetch(`${API_URL}/products`, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
    },
  })

  const data = await response.json()

  if (!response.ok) {
    throw new Error(data.message || 'Gagal mengambil produk')
  }

  return data
}

export const getProductById = async (productId) => {
  const response = await fetch(
    `${API_URL}/products/${productId}`,
    {
      method: 'GET',
      headers: {
        Accept: 'application/json',
      },
    }
  )

  const data = await response.json()

  if (!response.ok) {
    throw new Error(
      data.message || 'Gagal mengambil detail produk'
    )
  }

  return data
}

export const getCategories = async () => {
  const response = await fetch(`${API_URL}/categories`, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
    },
  })

  const data = await response.json()

  if (!response.ok) {
    throw new Error(data.message || 'Gagal mengambil kategori')
  }

  return data
}

/*
|--------------------------------------------------------------------------
| PUBLIC NEWS
|--------------------------------------------------------------------------
*/

export const getNews = async () => {
  const response = await fetch(`${API_URL}/news`, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
    },
  })

  const data = await response.json()

  if (!response.ok) {
    throw new Error(data.message || 'Gagal mengambil berita')
  }

  return data
}

/*
|--------------------------------------------------------------------------
| MAHASISWA PRODUCTS
|--------------------------------------------------------------------------
*/

export const createProduct = async (
  categoryId,
  name,
  description,
  initialFund,
  targetFund,
  launchDate
) => {
  const token = localStorage.getItem('token')

  const response = await fetch(`${API_URL}/products`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      category_id: categoryId,
      name,
      description,
      initial_fund: initialFund,
      target_fund: targetFund,
      launch_date: launchDate || null,
    }),
  })

  const data = await response.json()

  if (!response.ok) {
    const validationErrors = data.errors
      ? Object.values(data.errors).flat().join(' ')
      : ''

    throw new Error(
      validationErrors || data.message || 'Gagal membuat produk'
    )
  }

  return data
}

export const getMyProducts = async () => {
  const token = localStorage.getItem('token')

  const response = await fetch(`${API_URL}/products/mine`, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      Authorization: `Bearer ${token}`,
    },
  })

  const data = await response.json()

  if (!response.ok) {
    throw new Error(
      data.message || 'Gagal mengambil riwayat pengajuan'
    )
  }

  return data
}

/**
 * Memperbarui data produk milik mahasiswa.
 *
 * productData:
 * {
 *   categoryId,
 *   name,
 *   description,
 *   initialFund,
 *   targetFund,
 *   launchDate
 * }
 */
export const updateProduct = async (productId, productData) => {
  const token = localStorage.getItem('token')

  const response = await fetch(
    `${API_URL}/products/${productId}`,
    {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        category_id: productData.categoryId,
        name: productData.name,
        description: productData.description,
        initial_fund: productData.initialFund,
        target_fund: productData.targetFund,
        launch_date: productData.launchDate || null,
      }),
    }
  )

  const data = await response.json()

  if (!response.ok) {
    const validationErrors = data.errors
      ? Object.values(data.errors).flat().join(' ')
      : ''

    throw new Error(
      validationErrors ||
        data.message ||
        'Gagal memperbarui produk'
    )
  }

  return data
}

export const deleteMyProduct = async (productId) => {
  const token = localStorage.getItem('token')

  const response = await fetch(
    `${API_URL}/products/${productId}`,
    {
      method: 'DELETE',
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${token}`,
      },
    }
  )

  const data = await response.json()

  if (!response.ok) {
    throw new Error(
      data.message || 'Gagal menghapus produk'
    )
  }

  return data
}

export const uploadProductImages = async (
  productId,
  imageFiles
) => {
  const token = localStorage.getItem('token')
  const formData = new FormData()

  imageFiles.forEach((imageFile) => {
    formData.append('images[]', imageFile)
  })

  const response = await fetch(
    `${API_URL}/products/${productId}/images`,
    {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    }
  )

  const data = await response.json()

  if (!response.ok) {
    const validationErrors = data.errors
      ? Object.values(data.errors).flat().join(' ')
      : ''

    throw new Error(
      validationErrors || data.message || 'Gagal mengupload gambar'
    )
  }

  return data
}

export const getProductImages = async (productId) => {
  const token = localStorage.getItem('token')

  const response = await fetch(
    `${API_URL}/products/${productId}/images`,
    {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${token}`,
      },
    }
  )

  const data = await response.json()

  if (!response.ok) {
    throw new Error(
      data.message || 'Gagal mengambil gambar produk'
    )
  }

  return data
}

export const uploadProductDocument = async (
  productId,
  documentFile
) => {
  const token = localStorage.getItem('token')
  const formData = new FormData()

  formData.append('document', documentFile)

  const response = await fetch(
    `${API_URL}/products/${productId}/documents`,
    {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    }
  )

  const data = await response.json()

  if (!response.ok) {
    const validationErrors = data.errors
      ? Object.values(data.errors).flat().join(' ')
      : ''

    throw new Error(
      validationErrors ||
        data.message ||
        'Gagal mengupload dokumen produk'
    )
  }

  return data
}

export const getProductDocuments = async (productId) => {
  const token = localStorage.getItem('token')

  const response = await fetch(
    `${API_URL}/products/${productId}/documents`,
    {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${token}`,
      },
    }
  )

  const data = await response.json()

  if (!response.ok) {
    throw new Error(
      data.message || 'Gagal mengambil dokumen produk'
    )
  }

  return data
}

/*
|--------------------------------------------------------------------------
| CONTENT MANAGER PRODUCTS
|--------------------------------------------------------------------------
*/

export const getAdminProducts = async () => {
  const token = localStorage.getItem('token')

  const response = await fetch(
    `${API_URL}/content-manager/products`,
    {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${token}`,
      },
    }
  )

  const data = await response.json()

  if (!response.ok) {
    throw new Error(
      data.message ||
        'Gagal mengambil data produk content manager'
    )
  }

  return data
}

export const approveAdminProduct = async (productId) => {
  const token = localStorage.getItem('token')

  const response = await fetch(
    `${API_URL}/content-manager/products/${productId}/approve`,
    {
      method: 'PUT',
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${token}`,
      },
    }
  )

  const data = await response.json()

  if (!response.ok) {
    throw new Error(
      data.message || 'Gagal menyetujui produk'
    )
  }

  return data
}

export const rejectAdminProduct = async (
  productId,
  rejectionReason
) => {
  const token = localStorage.getItem('token')

  const response = await fetch(
    `${API_URL}/content-manager/products/${productId}/reject`,
    {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        rejection_reason: rejectionReason,
      }),
    }
  )

  const data = await response.json()

  if (!response.ok) {
    const validationErrors = data.errors
      ? Object.values(data.errors).flat().join(' ')
      : ''

    throw new Error(
      validationErrors || data.message || 'Gagal menolak produk'
    )
  }

  return data
}

export const updateAdminInvestment = async (
  productId,
  investmentAmount
) => {
  const token = localStorage.getItem('token')

  const response = await fetch(
    `${API_URL}/content-manager/products/${productId}/investment`,
    {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        investment_amount: investmentAmount,
      }),
    }
  )

  const data = await response.json()

  if (!response.ok) {
    const validationErrors = data.errors
      ? Object.values(data.errors).flat().join(' ')
      : ''

    throw new Error(
      validationErrors || data.message || 'Gagal memperbarui dana'
    )
  }

  return data
}

export const deleteRejectedProduct = async (productId) => {
  const token = localStorage.getItem('token')

  const response = await fetch(
    `${API_URL}/content-manager/products/${productId}`,
    {
      method: 'DELETE',
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${token}`,
      },
    }
  )

  const data = await response.json()

  if (!response.ok) {
    throw new Error(
      data.message || 'Gagal menghapus pengajuan produk'
    )
  }

  return data
}

/*
|--------------------------------------------------------------------------
| ADMIN USERS
|--------------------------------------------------------------------------
*/

export const getAdminUsers = async () => {
  const token = localStorage.getItem('token')

  const response = await fetch(`${API_URL}/admin/users`, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      Authorization: `Bearer ${token}`,
    },
  })

  const data = await response.json()

  if (!response.ok) {
    throw new Error(data.message || 'Gagal mengambil data user')
  }

  return data
}

export const createAdminUser = async (userData) => {
  const token = localStorage.getItem('token')

  const response = await fetch(`${API_URL}/admin/users`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(userData),
  })

  const data = await response.json()

  if (!response.ok) {
    const validationErrors = data.errors
      ? Object.values(data.errors).flat().join(' ')
      : ''

    throw new Error(
      validationErrors || data.message || 'Gagal menambahkan user'
    )
  }

  return data
}

export const updateAdminUser = async (userId, userData) => {
  const token = localStorage.getItem('token')

  const response = await fetch(
    `${API_URL}/admin/users/${userId}`,
    {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(userData),
    }
  )

  const data = await response.json()

  if (!response.ok) {
    const validationErrors = data.errors
      ? Object.values(data.errors).flat().join(' ')
      : ''

    throw new Error(
      validationErrors || data.message || 'Gagal memperbarui user'
    )
  }

  return data
}

export const deleteAdminUser = async (userId) => {
  const token = localStorage.getItem('token')

  const response = await fetch(
    `${API_URL}/admin/users/${userId}`,
    {
      method: 'DELETE',
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${token}`,
      },
    }
  )

  const data = await response.json()

  if (!response.ok) {
    throw new Error(data.message || 'Gagal menghapus user')
  }

  return data
}

/*
|--------------------------------------------------------------------------
| CONTENT MANAGER VOTING
|--------------------------------------------------------------------------
*/

export const voteProduct = async (productId, score) => {
  const token = localStorage.getItem('token')

  const response = await fetch(
    `${API_URL}/content-manager/products/${productId}/vote`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ score }),
    }
  )

  const data = await response.json()

  if (!response.ok) {
    const validationErrors = data.errors
      ? Object.values(data.errors).flat().join(' ')
      : ''

    throw new Error(
      validationErrors ||
        data.message ||
        'Gagal memberikan penilaian'
    )
  }

  return data
}

/*
|--------------------------------------------------------------------------
| ADMIN CATEGORIES
|--------------------------------------------------------------------------
*/

export const createAdminCategory = async (name) => {
  const token = localStorage.getItem('token')

  const response = await fetch(`${API_URL}/admin/categories`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ name }),
  })

  const data = await response.json()

  if (!response.ok) {
    const validationErrors = data.errors
      ? Object.values(data.errors).flat().join(' ')
      : ''

    throw new Error(
      validationErrors || data.message || 'Gagal menambahkan kategori'
    )
  }

  return data
}

export const updateAdminCategory = async (categoryId, name) => {
  const token = localStorage.getItem('token')

  const response = await fetch(
    `${API_URL}/admin/categories/${categoryId}`,
    {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ name }),
    }
  )

  const data = await response.json()

  if (!response.ok) {
    const validationErrors = data.errors
      ? Object.values(data.errors).flat().join(' ')
      : ''

    throw new Error(
      validationErrors || data.message || 'Gagal memperbarui kategori'
    )
  }

  return data
}

export const deleteAdminCategory = async (categoryId) => {
  const token = localStorage.getItem('token')

  const response = await fetch(
    `${API_URL}/admin/categories/${categoryId}`,
    {
      method: 'DELETE',
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${token}`,
      },
    }
  )

  const data = await response.json()

  if (!response.ok) {
    throw new Error(
      data.message || 'Gagal menghapus kategori'
    )
  }

  return data
}

/*
|--------------------------------------------------------------------------
| CONTENT MANAGER NEWS
|--------------------------------------------------------------------------
*/

export const getAdminNews = async () => {
  const token = localStorage.getItem('token')

  const response = await fetch(
    `${API_URL}/content-manager/news`,
    {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${token}`,
      },
    }
  )

  const data = await response.json()

  if (!response.ok) {
    throw new Error(
      data.message || 'Gagal mengambil data berita'
    )
  }

  return data
}

export const createAdminNews = async (newsData) => {
  const token = localStorage.getItem('token')

  const response = await fetch(
    `${API_URL}/content-manager/news`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(newsData),
    }
  )

  const data = await response.json()

  if (!response.ok) {
    const validationErrors = data.errors
      ? Object.values(data.errors).flat().join(' ')
      : ''

    throw new Error(
      validationErrors || data.message || 'Gagal menambahkan berita'
    )
  }

  return data
}

export const updateAdminNews = async (newsId, newsData) => {
  const token = localStorage.getItem('token')

  const response = await fetch(
    `${API_URL}/content-manager/news/${newsId}`,
    {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(newsData),
    }
  )

  const data = await response.json()

  if (!response.ok) {
    const validationErrors = data.errors
      ? Object.values(data.errors).flat().join(' ')
      : ''

    throw new Error(
      validationErrors || data.message || 'Gagal memperbarui berita'
    )
  }

  return data
}

export const deleteAdminNews = async (newsId) => {
  const token = localStorage.getItem('token')

  const response = await fetch(
    `${API_URL}/content-manager/news/${newsId}`,
    {
      method: 'DELETE',
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${token}`,
      },
    }
  )

  const data = await response.json()

  if (!response.ok) {
    throw new Error(data.message || 'Gagal menghapus berita')
  }

  return data
}