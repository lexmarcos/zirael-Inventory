import * as React from "react";
import AspectRatio from "@mui/joy/AspectRatio";
import Box from "@mui/joy/Box";
import Button from "@mui/joy/Button";
import Card from "@mui/joy/Card";
import IconButton from "@mui/joy/IconButton";
import Typography from "@mui/joy/Typography";
import { MdOutlineBookmarkAdd } from "react-icons/md";
import { IFormProductAdd } from "../form/types";

interface IProps {
  product: IFormProductAdd;
  category: string;
}

export default function CardProduct({ product, category }: IProps) {
  const { name, type, brand, description, price, imageUrl, attributes } = product;
  return (
    <Card variant="outlined" sx={{ width: 280 }}>
      <AspectRatio minHeight="300px" maxHeight="300px">
        <img src="https://i.imgur.com/K3RKvNG.png" loading="lazy" alt="" />
      </AspectRatio>
      <Typography level="h2" fontSize="lg" sx={{ mt: 2 }}>
        {name || "Nome do produto"}
      </Typography>
      <Typography level="body3">{category || "Categoria do produto"}</Typography>
      <Box sx={{ display: "flex" }}>
        <div>
          <Typography fontSize="xl" fontWeight="lg">
            {price > 0 ? price : "R$ 0,00"}
          </Typography>
        </div>
      </Box>
    </Card>
  );
}
