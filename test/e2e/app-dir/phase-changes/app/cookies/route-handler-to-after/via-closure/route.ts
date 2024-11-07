import { cookies } from 'next/headers'
import { unstable_after as after } from 'next/server'

export async function POST() {
  const cookieStore = await cookies()
  after(async () => {
    cookieStore.set('illegalCookie', 'too-late-for-that')
  })
  return new Response('')
}