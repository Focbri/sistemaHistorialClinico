export default function Footer() {
    return (
        <footer className="bg-[#1E5B9F] text-white py-2 w-full absolute bottom-0">
            <div className="w-full text-center flex flex-row justify-center items-center gap-2">
                <p>&copy; {new Date().getFullYear()} Todos los derechos reservados.</p>
                <div className="flex justify-center items-center gap-2">
                     <a href="https://www.facebook.com/ClinicaVisualOphthalmics/?locale=es_LA" target="_blank">
                        <svg xmlns="http://www.w3.org/2000/svg" class="info" width="24" height="24" viewBox="0 0 24 24"><path fill="#fff" d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c5.05-.5 9-4.76 9-9.95"/></svg>
                    </a>
                    <a href="https://maps.app.goo.gl/q8hF95pAswprypRZ8" target="_blank">
                        <svg xmlns="http://www.w3.org/2000/svg" class="info" width="32" height="32" viewBox="0 0 32 32"><path fill="#fff" d="m16 24l-6.09-8.6A8.14 8.14 0 0 1 16 2a8.08 8.08 0 0 1 8 8.13a8.2 8.2 0 0 1-1.8 5.13Zm0-20a6.07 6.07 0 0 0-6 6.13a6.2 6.2 0 0 0 1.49 4L16 20.52L20.63 14A6.24 6.24 0 0 0 22 10.13A6.07 6.07 0 0 0 16 4"/><circle cx="16" cy="9" r="2" fill="#fff"/><path fill="#fff" d="M28 12h-2v2h2v14H4V14h2v-2H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h24a2 2 0 0 0 2-2V14a2 2 0 0 0-2-2"/></svg>
                    </a>
                </div>
            </div>
        </footer>
    );
}
