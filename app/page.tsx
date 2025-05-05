import Image from "next/image";

export default function Home() {
    return (
        <div className="items-start justify-items-center min-h-screen p-8 sm:p-20 font-[family-name:var(--font-geist-sans)]">
            <main className="flex flex-col gap-[32px]">
                <h1 className="lg:text-5xl">Catálogo Pessoal de Livros e Filmes</h1>
                <p className="text-lg font-medium">
                    Organize suas leituras favoritos em um só lugar. Com este catálogo pessoal, você pode adicionar obras que já viu, marcar o que ainda quer ler,
                    e destacar seus favoritos. Tudo isso com uma interface rápida, filtrável e visual, pensada para facilitar o acesso ao seu acervo.
                </p>
                <p className="text-lg font-medium">
                    Cadastre-se e comece já!!!    
                </p>
            </main>
        </div>
    );
}
