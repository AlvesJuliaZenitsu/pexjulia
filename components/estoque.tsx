import Link from "next/link";

export default function Estoque() {
  return (
    <p>
      <Link
        href={{
          pathname: "/about",
          query: { name: "test" },
        }}
      >
        About
      </Link>
    </p>
  );
}
