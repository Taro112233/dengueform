import Link from "next/link";
import Image from "next/image";
import Logo from "@/public/logo.png"

export function Navbar() {
  return <nav className="flex items-center justify-center py-5">
    <Link href="/" className="flex items-center gap-2">
    <Image src={Logo} alt="Takeda logo" height={40}/>
      <h1 className="text-2xl font-bold">
        Vaccine<span className="text-primary">Dengue</span>
      </h1>
    </Link>
  </nav>
}