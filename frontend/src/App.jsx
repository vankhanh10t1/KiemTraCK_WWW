import { useCallback, useEffect, useMemo, useState } from 'react'
import './App.css'

const API = 'http://localhost:8080/api'

const emptyProduct = {
  name: '',
  price: '',
  quantity: '',
  description: '',
  imageUrl: 'https://via.placeholder.com/150',
  categoryId: '',
}

function App() {
  const [user, setUser] = useState(null)
  const [route, setRoute] = useState('login')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(true)

  const isAdmin = useMemo(() => user?.roles?.includes('ROLE_ADMIN'), [user])

  const request = useCallback(async (path, options = {}) => {
    const res = await fetch(`${API}${path}`, {
      credentials: 'include',
      headers: { 'Content-Type': 'application/json', ...options.headers },
      ...options,
    })

    if (!res.ok) {
      const data = await res.json().catch(() => ({}))
      throw new Error(data.message || 'Có lỗi xảy ra')
    }

    if (res.status === 204) return null
    return res.json().catch(() => null)
  }, [])

  // ✅ FIX: sync user + route rõ ràng
  const me = useCallback(async () => {
    try {
      const data = await request('/auth/me')

      setUser(data)

      if (data?.roles?.includes('ROLE_ADMIN')) {
        setRoute('admin')
      } else {
        setRoute('products')
      }
    } catch {
      setUser(null)
      setRoute('login')
    } finally {
      setLoading(false)
    }
  }, [request])

  useEffect(() => {
    me()
  }, [me])

  async function login(username, password) {
    const body = new URLSearchParams({ username, password })

    const res = await fetch(`${API}/auth/login`, {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: body.toString(),
    })

    if (!res.ok) throw new Error('Sai tài khoản hoặc mật khẩu')

    await me()
    setMessage('Đăng nhập thành công')
  }

  async function logout() {
    await fetch(`${API}/auth/logout`, {
      method: 'POST',
      credentials: 'include',
    })

    setUser(null)
    setRoute('login')
    setMessage('Đã đăng xuất')
  }

  function go(nextRoute) {
    setMessage('')
    setRoute(nextRoute)
  }

  if (loading) return <main className="center">Đang tải...</main>

  return (
    <main className="app-shell">

      {/* HEADER */}
      {user && (
        <header className="topbar">
          <button
            className="brand"
            type="button"
            onClick={() => go(isAdmin ? 'admin' : 'products')}
          >
            Điện máy KhanhTV  
          </button>

          <nav>
            <button
              className={`secondary ${route === 'products' ? 'active' : ''}`}
              type="button"
              onClick={() => go('products')}
            >
              Sản phẩm
            </button>

            {isAdmin && (
              <button
                className={`secondary ${route === 'admin' ? 'active' : ''}`}
                type="button"
                onClick={() => go('admin')}
              >
                Quản trị
              </button>
            )}
          </nav>

          <div className="account">
            <span>{user.fullName || user.username}</span>
            <button className="secondary" type="button" onClick={logout}>
              Logout
            </button>
          </div>
        </header>
      )}

      {message && <div className="toast">{message}</div>}

      {/* LOGIN (FIX: chỉ 1 chỗ duy nhất) */}
      {route === 'login' && <LoginPage onLogin={login} />}

      {/* APP CONTENT */}
      {route !== 'login' && user && (
        <div className="content-layout">
          <aside className="sidebar">
            <div className="sidebar-card">
              <span className="sidebar-label">Tài khoản</span>
              <strong>{user.fullName || user.username}</strong>
              <p>{isAdmin ? 'Quản trị viên' : 'Khách hàng'}</p>
            </div>

            <nav className="sidebar-nav">
              <button
                className={route === 'products' ? 'active' : ''}
                type="button"
                onClick={() => go('products')}
              >
                Sản phẩm
              </button>
              {isAdmin && (
                <button
                  className={route === 'admin' ? 'active' : ''}
                  type="button"
                  onClick={() => go('admin')}
                >
                  Quản trị
                </button>
              )}
            </nav>

            <div className="sidebar-footer">
              <button className="secondary" type="button" onClick={logout}>
                Đăng xuất
              </button>
            </div>
          </aside>

          <section className="content-area">
            {route === 'products' && <ProductList request={request} />}

            {route === 'admin' && isAdmin && (
              <AdminProductList
                request={request}
                go={go}
                setMessage={setMessage}
              />
            )}

            {route.startsWith('form') && isAdmin && (
              <ProductForm
                request={request}
                go={go}
                setMessage={setMessage}
                productId={route.split(':')[1]}
              />
            )}
          </section>
        </div>
      )}

    </main>
  )
}

/* ---------------- LOGIN ---------------- */
function LoginPage({ onLogin }) {
  const [username, setUsername] = useState('admin')
  const [password, setPassword] = useState('123456')
  const [error, setError] = useState('')

  async function submit(e) {
    e.preventDefault()
    setError('')

    try {
      await onLogin(username, password)
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <section className="login-page">
      <form className="login-panel" onSubmit={submit}>
        <h1>Điện máy KhanhTV</h1>

        <label>
          Tài khoản
          <input value={username} onChange={(e) => setUsername(e.target.value)} />
        </label>

        <label>
          Mật khẩu
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        </label>

        {error && <p className="error">{error}</p>}

        <button className="primary" type="submit">
          Đăng nhập
        </button>

        <p className="hint">admin / 123456 hoặc user / 123456</p>
      </form>
    </section>
  )
}


function ProductList({ request }) {
  const [products, setProducts] = useState([])
  const [keyword, setKeyword] = useState('')
  const [selectedProduct, setSelectedProduct] = useState(null)

  useEffect(() => {
    request('/products').then(setProducts)
  }, [request])

  async function load(search = keyword) {
    const query = search ? `?keyword=${encodeURIComponent(search)}` : ''
    setProducts(await request(`/products${query}`))
  }

  async function showDetail(id) {
    setSelectedProduct(await request(`/products/${id}`))
  }

  return (
    <section className="page">
      <div className="page-head">
        <div>
          <h1>Danh sách sản phẩm</h1>
          <p>{products.length} sản phẩm</p>
        </div>
        <SearchBox keyword={keyword} setKeyword={setKeyword} onSearch={load} />
      </div>
      <div className="product-grid">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} onDetail={showDetail} />
        ))}
      </div>
      {selectedProduct && (
        <ProductDetail product={selectedProduct} onClose={() => setSelectedProduct(null)} />
      )}
    </section>
  )
}

function AdminProductList({ request, go, setMessage }) {
  const [products, setProducts] = useState([])
  const [keyword, setKeyword] = useState('')
  const [selectedProduct, setSelectedProduct] = useState(null)

  useEffect(() => {
    request('/admin/products').then(setProducts)
  }, [request])

  async function load(search = keyword) {
    const query = search ? `?keyword=${encodeURIComponent(search)}` : ''
    setProducts(await request(`/admin/products${query}`))
  }

  async function remove(id) {
    if (!confirm('Xoá sản phẩm này?')) return
    await request(`/admin/products/${id}`, { method: 'DELETE' })
    setMessage('Xoá sản phẩm thành công')
    load()
  }

  async function showDetail(id) {
    setSelectedProduct(await request(`/products/${id}`))
  }

  return (
    <section className="page">
      <div className="page-head">
        <div>
          <h1>Quản lý sản phẩm</h1>
          <p>{products.length} sản phẩm</p>
        </div>
        <div className="actions">
          <SearchBox keyword={keyword} setKeyword={setKeyword} onSearch={load} />
          <button className="primary" type="button" onClick={() => go('form')}>Thêm</button>
        </div>
      </div>
      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Ảnh</th>
              <th>Tên</th>
              <th>Danh mục</th>
              <th>Giá</th>
              <th>Số lượng</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id}>
                <td>
                  <img className="admin-thumb" src={product.imageUrl || 'https://via.placeholder.com/150'} alt={product.name} />
                </td>
                <td>
                  <button className="link-button" type="button" onClick={() => showDetail(product.id)}>
                    {product.name}
                  </button>
                </td>
                <td>{product.category?.name}</td>
                <td>{money(product.price)}</td>
                <td>{product.quantity}</td>
                <td className="row-actions">
                  <button type="button" onClick={() => go(`form:${product.id}`)}>Sửa</button>
                  <button className="danger" type="button" onClick={() => remove(product.id)}>Xoá</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {selectedProduct && (
        <ProductDetail product={selectedProduct} onClose={() => setSelectedProduct(null)} />
      )}
    </section>
  )
}

function ProductForm({ request, go, setMessage, productId }) {
  const [product, setProduct] = useState(emptyProduct)
  const [categories, setCategories] = useState([])
  const [error, setError] = useState('')
  const [uploading, setUploading] = useState(false)
  const isEdit = Boolean(productId)

  useEffect(() => {
    request('/admin/categories').then(setCategories)
    if (isEdit) {
      request(`/products/${productId}`).then((data) => setProduct({
        name: data.name || '',
        price: data.price || '',
        quantity: data.quantity ?? '',
        description: data.description || '',
        imageUrl: data.imageUrl || '',
        categoryId: data.category?.id || '',
      }))
    }
  }, [isEdit, productId, request])

  function change(field, value) {
    setProduct((current) => ({ ...current, [field]: value }))
  }

  async function uploadImage(file) {
    if (!file) return
    setUploading(true)
    setError('')
    try {
      const formData = new FormData()
      formData.append('file', file)
      const res = await fetch(`${API}/admin/uploads`, {
        method: 'POST',
        credentials: 'include',
        body: formData,
      })
      if (!res.ok) throw new Error('Upload anh that bai')
      const data = await res.json()
      change('imageUrl', data.url)
    } catch (err) {
      setError(err.message)
    } finally {
      setUploading(false)
    }
  }

  async function submit(e) {
    e.preventDefault()
    setError('')
    try {
      const payload = {
        ...product,
        price: Number(product.price),
        quantity: Number(product.quantity),
        categoryId: Number(product.categoryId),
      }
      await request(isEdit ? `/admin/products/${productId}` : '/admin/products', {
        method: isEdit ? 'PUT' : 'POST',
        body: JSON.stringify(payload),
      })
      setMessage(isEdit ? 'Cập nhật sản phẩm thành công' : 'Thêm sản phẩm thành công')
      go('admin')
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <section className="page narrow">
      <div className="page-head">
        <h1>{isEdit ? 'Cập nhật sản phẩm' : 'Thêm sản phẩm'}</h1>
        <button type="button" onClick={() => go('admin')}>Quay lại</button>
      </div>
      <form className="product-form" onSubmit={submit}>
        <label>Tên sản phẩm<input value={product.name} onChange={(e) => change('name', e.target.value)} /></label>
        <label>Giá<input type="number" min="1" value={product.price} onChange={(e) => change('price', e.target.value)} /></label>
        <label>Số lượng<input type="number" min="0" value={product.quantity} onChange={(e) => change('quantity', e.target.value)} /></label>
        <label>Danh mục
          <select value={product.categoryId} onChange={(e) => change('categoryId', e.target.value)}>
            <option value="">Chọn danh mục</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>{category.name}</option>
            ))}
          </select>
        </label>
        <label>Link ảnh<input value={product.imageUrl} onChange={(e) => change('imageUrl', e.target.value)} /></label>
        <label>Chọn ảnh từ máy<input type="file" accept="image/*" onChange={(e) => uploadImage(e.target.files[0])} /></label>
        {uploading && <p className="hint wide">Đang upload ảnh...</p>}
        {product.imageUrl && <img className="form-preview wide" src={product.imageUrl} alt="Xem trước sản phẩm" />}
        <label className="wide">Mô tả<textarea value={product.description} onChange={(e) => change('description', e.target.value)} /></label>
        {error && <p className="error wide">{error}</p>}
        <button className="primary wide" type="submit">Lưu</button>
      </form>
    </section>
  )
}

function SearchBox({ keyword, setKeyword, onSearch }) {
  return (
    <form className="search" onSubmit={(e) => { e.preventDefault(); onSearch() }}>
      <input placeholder="Tìm theo tên" value={keyword} onChange={(e) => setKeyword(e.target.value)} />
      <button type="submit">Tìm</button>
    </form>
  )
}

function ProductCard({ product, onDetail }) {
  return (
    <article className="product-card">
      <img src={product.imageUrl || 'https://via.placeholder.com/150'} alt={product.name} />
      <div>
        <h2>{product.name}</h2>
        <p className="category">{product.category?.name}</p>
        <p className="price">{money(product.price)}</p>
        <p>Còn: {product.quantity}</p>
        <p>{product.description}</p>
        <button type="button" onClick={() => onDetails(product.id)}>Chi tiết</button>
      </div>
    </article>
  )
}

function ProductDetail({ product, onClose }) {
  return (
    <div className="modal-backdrop" role="presentation" onClick={onClose}>
      <section className="detail-modal" role="dialog" aria-modal="true" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" type="button" onClick={onClose}>Đóng</button>
        <img src={product.imageUrl || 'https://via.placeholder.com/150'} alt={product.name} />
        <div className="detail-body">
          <p className="category">{product.category?.name || 'Chưa có danh mục'}</p>
          <h1>{product.name}</h1>
          <p className="price">{money(product.price)}</p>
          <dl>
            <div>
              <dt>Số lượng</dt>
              <dd>{product.quantity}</dd>
            </div>
            <div>
              <dt>Danh mục</dt>
              <dd>{product.category?.name || '-'}</dd>
            </div>
            <div className="wide">
              <dt>Mô tả</dt>
              <dd>{product.description || 'Không có mô tả'}</dd>
            </div>
          </dl>
        </div>
      </section>
    </div>
  )
}

function money(value) {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value || 0)
}

export default App
