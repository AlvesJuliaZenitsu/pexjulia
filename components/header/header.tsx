import Image from "next/image";
import Link from "next/link";

export default function Header() {
  return (
    <div className="p-5 flex flex-row-reverse bg-orange-100 gap-5 min-h-screen">
      <div className="flex flex-row-reverse justify-between  w-full max-w-10/10">
        <div>
          <Image src="/assets/userr.svg" alt="user" width={55} height={55} />
        </div>
        <div className="pl-170  ">
          <Image src="/assets/logo.png" alt="logo" width={264} height={132} />
        </div>
      </div>

      <nav className="bg-amber-50 w-full max-w-1/23 flex flex-col justify-start pt-30 gap-15 flex min-h-50% items-center rounded-md0">
        <div className="flex justify-center flex-col gap-1 cursor-pointer">
          <Image src="/assets/inicio.svg" alt="logo" width={50} height={50} />
          <span className="flex justify-center text-[#8C4009]">Inicio</span>
        </div>
        <div className="gap-1">
          <Link href="/estoque" replace>
            <Image
              src="/assets/estoque.svg"
              alt="logo"
              width={60}
              height={58}
            />
            <span className=" flex justify-center text-[#8C4009]">Estoque</span>
          </Link>
        </div>
      </nav>
      <div></div>
    </div>
  );
}
