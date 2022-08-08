# Qwik + Supabase

A simple wrapper around Supabase.js to enable usage within Qwik.

## Installation

```bash
npm install @supabase/supabase-js qwik-supabase # or pnpm or yarn
```

## Quick start

In a component higher up in the tree you want to make the Supabase client available to, use the `SupabaseProvider` and pass the supabase client with your credentials.

Note, you need to create a lazy loaded reference around the client closure, by using Qwik's `$`.

```tsx
import { component$, $ } from '@builder.io/qwik'
import { SupabaseProvider } from 'qwik-supabase'

// import initialized client
import { supabase } from '~/supabase'

export const App = component$(() => {
  return (
    <SupabaseProvider client$={$(() => supabase)}>
      <Dashboard />
    </SupabaseProvider>
  )
})
```

This will make the Supabase client available anywhere along the component tree.

## Use the primitive

To access the Supabase client, you need to first get the QRL promise and then invoke it. You can
delay invoking it in order to keep the client serializable and pass it to a handler.

```tsx
import { component$ } from '@builder.io/qwik'
import { useSupabase, QRLSupaBase } from 'qwik-supabase'

export async function loginUser(e: Event, getSupabase: QRLSupaBase) {
  // Parse login data from `e` ...

  const supabase = await getSupabase()

  const result = await supabase.auth.signIn({
    email,
    password,
  })

  // Do something with result...
}

export const Login = component$(() => {
  const getSupabase = useSupabase()

  return (
    <button onClick$={(e) => loginUser(e, getSupabase)}>
      Login
    </button>
  )
})
```

Other available primitives

```ts
import {
  useOnAuthStateChange,
  useSupabaseAuth,
  useSupabaseFrom,
  useSupabaseStorage,
} from 'qwik-supabase'
```

Note, that each of the above, with the exception of `useOnAuthStateChange` follow the same pattern demonstrated above with respect to obtaining the client, for example:

```tsx
// Get QRL promise...
const getAuth = useSupabaseAuth()

// When you want to use it...
const auth = await getAuth()
```

With `useOnAuthStateChange` however you simply call it directly, passing the callback function you want invoked on every change. Note though, the callback itself needs to be wrapped with `$`, similar to how the client is when passing it to the provider:

```tsx
export const Dashboard = component$(() => {
  useOnAuthStateChange($(() => (event, session) => console.log(event, session)))

  return <DashboardStuff />
})
```

## License

WTFPL

## Acknowledgments

This is more or less a port of [Wobsoriano's Solid Supabase wrapper](https://github.com/wobsoriano/solid-supabase). Check it out!
