export type Spec = { name: string; price: number; stock: number };

export type Product = {
    id: number;
    preview: string[];
    title: string;
    desc?: string;
    link?: string;
    details: string[];
    status: "on" | "off";
    specs: Spec[];
};
