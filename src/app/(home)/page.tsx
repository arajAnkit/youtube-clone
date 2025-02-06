import Image from "next/image";

export default function Home() {
  return (
    <div className="">
      <Image src="/logo.svg" height={50} width={50} alt="logo" />
      <p className="text-xl font-semibold tracking-tight">NewTube</p>
    </div>
  );
}
