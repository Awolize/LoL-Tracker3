// app/server/userExists.ts
import { createServerFn } from '@tanstack/react-start'

const checkUsername = createServerFn({
  method: 'POST',
})
  .inputValidator((data: {username:string}) => data.username)
  .handler(async ( {data}) => {
    // simulate server-side processing
     await new Promise((resolve) => setTimeout(resolve, 500))
    // await db.insert(todos).values({ title: data.title })

console.log(data);

    return { success: true }
  })


import { createFileRoute, useNavigate } from '@tanstack/react-router'
import * as React from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { RegionListSelector, regions } from '@/components/region-list-selector'
import { Loading } from '@/components/ui/loading'
import { MainText } from "@/components/header/MainText";
import { SubText } from "@/components/header/SubText";
import { ArrowRight, Send } from 'lucide-react';

export const Route = createFileRoute('/')({ component: Home })

export function Home() {
  const navigate = useNavigate()
  const qc = useQueryClient()
  const [username, setUsername] = React.useState('')
  const [selectedRegion, setSelectedRegion] = React.useState(regions[0])

  const mutation = useMutation({
    mutationFn: (username: string) => checkUsername({data: {username}}),
    onSuccess: () => {
      qc.invalidateQueries() // optional: invalidate queries if needed
      // navigate after server check
      // navigate({
      //   to: '/$region/$username/layout',
      //   params: { region: selectedRegion.name, username: username.replace('#', '-').toLowerCase() },
      // })
    },
  })

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!username || !selectedRegion) return

    const cleanUsername = username.replace('#', '-').toLowerCase()
    mutation.mutate(cleanUsername)
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-[url('/background-1.webp')] bg-center bg-cover">
      <div className="flex w-full animate-pulse2 flex-col items-center justify-center gap-4 bg-black py-16">
        <div>
          <MainText />
          <SubText />
        </div>
        <div className="flex h-full w-full flex-row items-center justify-center gap-4 px-4 py-2">
          <h1 className="font-extrabold text-2xl text-foreground tracking-tight sm:text-[2rem] ">
            <RegionListSelector
              selectedRegion={selectedRegion}
              setSelectedRegion={setSelectedRegion}
            />
          </h1>
        <form onSubmit={onSubmit} className="flex flex-row gap-0.5">
  <div className="flex flex-col gap-1">
    <input
      value={username}
      onChange={(e) => setUsername(e.target.value)}
      placeholder="lol.awot#dev"
      className="h-12 w-full rounded-l bg-primary text-center text-xl placeholder:text-primary-foreground/50 focus:outline-none focus:ring-1 focus:ring-primary"
    />
    <div className="text-primary-foreground/50 text-xs">
      Remember to include the # and tagline like: Awot#dev
    </div>
  </div>
  <button
    type="submit"
    className="h-12 w-8 rounded-r bg-primary p-1 hover:bg-primary-foreground/20 flex items-center justify-center"
  >
    {mutation.isPending ? <Loading /> : <ArrowRight className="w-5 h-5 text-primary-foreground" />}
  </button>
</form>
        </div>
      </div>
    </main>
  )
}
