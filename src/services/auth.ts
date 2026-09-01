/**
 * auth.ts
 * -----------------------------------------------------------------------
 * VULNERABILIDAD SEMBRADA: MASVS-AUTH-1: el cliente decodifica el JWT y
 * confía en su payload SIN verificar la firma, y además nunca expira la
 * sesión local aunque el token del backend sí lo haga.
 *
 * Cómo explotarla en el lab:
 *   - Con Frida, hookear isSessionValid() y forzar que retorne true.
 *   - O directamente: interceptar el JWT, editar el payload (ej. cambiar
 *     "role": "customer" a "role": "admin") sin resignar, y ver que la
 *     UI igual confía en ese campo para mostrar funciones de admin.
 *
 * Fix esperado:
 *   - Nunca confiar en claims del JWT en el cliente para decisiones de
 *     autorización; el backend valida firma + expiración en cada request.
 *   - El cliente solo debe usar el token como bearer opaco.
 * -----------------------------------------------------------------------
 */
import type { Session } from '../utils/types';

let currentSession: Session | null = null;

function decodeJwtPayload(token: string): { role: string; sub: string } {
  // VULNERABLE: decodifica el payload base64 sin verificar la firma
  const payload = token.split('.')[1];
  return JSON.parse(atob(payload));
}

export function establishSession(jwtToken: string): Session {
  const payload = decodeJwtPayload(jwtToken);
  // VULNERABLE: la app confía en payload.role para decisiones de UI/negocio
  currentSession = {
    token: jwtToken,
    role: payload.role,
    userId: payload.sub,
    // VULNERABLE: no se guarda ni respeta "exp" -> la sesión nunca expira
    // localmente aunque el token del backend sí haya vencido.
  };
  return currentSession;
}

export function isSessionValid(): boolean {
  return currentSession !== null;
}

export function getCurrentRole(): string {
  return currentSession?.role ?? 'guest';
}
