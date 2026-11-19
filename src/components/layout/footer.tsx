export function Footer() {
  return (
    <footer className="border-t bg-muted/40 py-6 md:py-0">
      <div className="container mx-auto flex flex-col items-center justify-between gap-4 px-4 md:h-24 md:flex-row">
        <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
          Built by{" "}
          <a
            href="https://github.com/Avin1731"
            target="_blank"
            rel="noreferrer"
            className="font-medium underline underline-offset-4"
          >
            Avin1731
          </a>
          . The source code is available on{" "}
          <a
            href="https://github.com/Avin1731/XtePort.nx-1412"
            target="_blank"
            rel="noreferrer"
            className="font-medium underline underline-offset-4"
          >
            GitHub
          </a>
          .
        </p>
      </div>
    </footer>
  )
}