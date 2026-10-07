declare module "html2pdf.js" {
  interface Html2PdfOptions {
    margin?: number | [number, number, number, number];
    filename?: string;
    image?: { type?: string; quality?: number };
    html2canvas?: {
      scale?: number;
      useCORS?: boolean;
      letterRendering?: boolean;
      backgroundColor?: string;
      logging?: boolean;
      allowTaint?: boolean;
      scrollX?: number;
      scrollY?: number;
      windowWidth?: number;
    };
    jsPDF?: {
      unit?: string;
      format?: string | [number, number];
      orientation?: "portrait" | "landscape";
      compress?: boolean;
    };
    pagebreak?: {
      mode?: string | string[];
      before?: string | string[];
      after?: string | string[];
      avoid?: string | string[];
    };
    enableLinks?: boolean;
  }

  interface Html2PdfChain {
    set(opt: Html2PdfOptions): Html2PdfChain;
    from(element: HTMLElement): Html2PdfChain;
    toPdf(): Html2PdfChain;
    save(): Promise<void>;
    output(type: string, options?: object): Promise<unknown>;
  }

  function html2pdf(): Html2PdfChain;
  function html2pdf(element: HTMLElement, opt?: Html2PdfOptions): Html2PdfChain;

  export = html2pdf;
}
