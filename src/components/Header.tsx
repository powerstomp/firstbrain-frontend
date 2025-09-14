import { Link } from '@tanstack/react-router'

export default function Header() {
  return (
    <header className="p-2 bg-white text-black border">
      <nav className="flex flex-row gap-4 font-bold">
        <Link to="/">Home</Link>
      </nav>
    </header>
  )
}
