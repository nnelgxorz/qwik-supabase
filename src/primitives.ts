import type { AuthChangeEvent, Session, SupabaseClient } from '@supabase/supabase-js'
import { useContext, $, QRL, useClientEffect$ } from '@builder.io/qwik'
import { SupabaseContext } from './SupabaseProvider'

export type QRLSupaBase = QRL<() => SupabaseClient>

export function useSupabase(): QRLSupaBase {
  const ctx = useContext(SupabaseContext)

  if (!ctx) {
    throw new Error(
      'useSupabase must be used within a component tree that calls useContextProvider'
    )
  }

  return ctx
}

export type QRLSupaBaseAuth = QRL<() => Promise<SupabaseClient['auth']>>

export function useSupabaseAuth(): QRLSupaBaseAuth {
  const supabase = useSupabase()
  return $(async () => (await supabase()).auth)
}

export type QRLSupaBaseStorage = QRL<() => Promise<SupabaseClient['storage']>>

export function useSupabaseStorage(): QRLSupaBaseStorage {
  const supabase = useSupabase()
  return $(async () => (await supabase()).storage)
}

export type QRLSupaBaseFrom = QRL<() => Promise<SupabaseClient['from']>>

export function useSupabaseFrom(): QRLSupaBaseFrom {
  const supabase = useSupabase()
  return $(async () => (await supabase()).from)
}

type AuthChangeHandler = (event: AuthChangeEvent, session: Session | null) => void

export function registerAuthListener(auth: SupabaseClient['auth'], callback: AuthChangeHandler) {
  const { data } = auth.onAuthStateChange(callback)
  return data
}

type QRLAuthChangeHandler = QRL<() => AuthChangeHandler>

export async function useOnAuthStateChange(getCallback$: QRLAuthChangeHandler): Promise<void> {
  const getAuth = useSupabaseAuth()

  useClientEffect$(async () => {
    const auth = await getAuth()
    const callback = await getCallback$()

    const authListener = registerAuthListener(auth, callback)

    // If the user is already authn'd call this manually as it won't trigger a change.
    if (auth.session()) callback('SIGNED_IN', auth.session())

    // Cleanup if necessary.
    return () => authListener?.unsubscribe()
  })
}
