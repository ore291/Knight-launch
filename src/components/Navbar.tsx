import { NavLink } from 'react-router';

export default function Navbar() {
  return (
    <nav className="flex justify-between items-center h-16 px-6 border-b bg-white shadow-sm py-4">
      <NavLink to={'/'}><div className="text-xl font-bold">Knight Launch</div></NavLink>
      <div className="flex items-center gap-4">
       
        <button className="bg-purple-600 text-white px-4 py-1 rounded">
          Export
        </button>
        <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
      </div>
    </nav>
  )
}
