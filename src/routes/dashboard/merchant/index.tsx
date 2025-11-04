import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/dashboard/merchant/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/dashboard/merchant/"!</div>
}
