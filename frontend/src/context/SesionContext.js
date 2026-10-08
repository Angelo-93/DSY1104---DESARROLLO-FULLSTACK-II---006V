import { createContext } from 'react'

/**
 * Canal por donde SesionProvider comparte el usuario con sesión iniciada.
 * Parte en null para que useSesion detecte si se usa fuera del Provider.
 */
export const SesionContext = createContext(null)
