import Head from "next/head";
import Image from "next/image";
import { Inter } from "next/font/google";
import styles from "@/styles/Home.module.css";
import { useEffect, useState } from "react";
import { IProduct } from "./api/products/types";
import "@fontsource/public-sans";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  const getProducts = async () => {
    console.log("toma");
    const response: Response = await fetch("/api/products");
    const productsResponse: IProduct[] = await response.json();
    setProducts(productsResponse);
  };

  const [products, setProducts] = useState<IProduct[]>([]);

  useEffect(() => {
    getProducts();
  }, []);
  return <></>;
}
