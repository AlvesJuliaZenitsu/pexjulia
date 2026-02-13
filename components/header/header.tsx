import Image from "next/image";

export default function Header() {
  return (
    <div>
      <nav></nav>
      <header>
        <Image src="assets/userr.svg" alt="user" width={48} height={48} />
      </header>
    </div>
  );
}
