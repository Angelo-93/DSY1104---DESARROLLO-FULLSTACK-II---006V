/*
 * Pruebas de las vistas de contenido migradas de la EP1 (Nosotros, Blogs,
 * detalle de blog y Contacto): confirman que cada una muestra su contenido.
 */
import { render, screen } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'

import { BLOGS } from '../../data/blogs.js'
import PaginaBlogs from './PaginaBlogs.jsx'
import PaginaContacto from './PaginaContacto.jsx'
import PaginaDetalleBlog from './PaginaDetalleBlog.jsx'
import PaginaNosotros from './PaginaNosotros.jsx'

function renderizarEn(ruta, elemento, patron) {
  return render(
    <MemoryRouter initialEntries={[ruta]}>
      <Routes>
        <Route path={patron} element={elemento} />
      </Routes>
    </MemoryRouter>,
  )
}

describe('Páginas informativas', () => {
  it('Nosotros muestra la misión y las áreas', () => {
    renderizarEn('/nosotros', <PaginaNosotros />, '/nosotros')

    expect(screen.getByRole('heading', { name: 'Nuestra misión' })).toBeTruthy()
    expect(screen.getByRole('heading', { name: 'Logística y despacho' })).toBeTruthy()
  })

  it('Blogs lista un artículo por cada blog con su enlace al detalle', () => {
    renderizarEn('/blogs', <PaginaBlogs />, '/blogs')

    const enlaces = screen.getAllByRole('link', { name: 'Leer caso completo' })
    expect(enlaces.map((e) => e.getAttribute('href'))).toEqual(BLOGS.map((b) => `/blogs/${b.id}`))
  })

  it('el detalle de blog muestra el artículo pedido en la URL', () => {
    renderizarEn('/blogs/laboratorio-escolar', <PaginaDetalleBlog />, '/blogs/:idBlog')

    expect(screen.getByRole('heading', { level: 1 }).textContent).toBe(BLOGS[1].titulo)
  })

  it('un blog inexistente muestra "Artículo no encontrado"', () => {
    renderizarEn('/blogs/no-existe', <PaginaDetalleBlog />, '/blogs/:idBlog')

    expect(screen.getByRole('heading', { name: 'Artículo no encontrado' })).toBeTruthy()
  })

  it('Contacto muestra el formulario', () => {
    renderizarEn('/contacto', <PaginaContacto />, '/contacto')

    expect(screen.getByRole('button', { name: 'Enviar mensaje' })).toBeTruthy()
  })
})
