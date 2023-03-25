import { Grid, Sheet } from "@mui/joy";
import React from "react";
import FormAddProduct from "./form";
import CardProduct from "./cardProduct";
import { useForm } from "react-hook-form";
import { IFormProductAdd } from "./form/types";
import { useQuery } from "@tanstack/react-query";
import { getCategories } from "@/services/api/categories";
import { ICategories } from "@/pages/api/categories/types";

function ProductAdd() {
  const { control, handleSubmit, watch, setValue, getValues } = useForm<IFormProductAdd>({
    defaultValues: {
      name: "",
      type: {
        value: "",
        label: "",
      },
      category: "",
      brand: "",
      description: "",
      price: 0.0,
      imageUrl: "test",
      attributes: {
        weightOrVolume: { value: 0.0, label: "Volume" },
        measure: {
          value: "g",
          label: "Medida",
        },
      },
    },
  });

  const [categories, setCategories] = React.useState<ICategories[]>([]);

  const { isFetchedAfterMount: isFetchedAfterMountCategories } = useQuery(
    ["categories"],
    getCategories,
    {
      onSuccess: ({ data }: { data: ICategories[] }) => {
        setCategories(data);
      },
    }
  );
  return (
    <Grid container spacing={2} sx={{ flexGrow: 1 }}>
      <Grid xs={12} md={5}>
        <FormAddProduct
          control={control}
          handleSubmit={handleSubmit}
          watch={watch}
          setValue={setValue}
        />
      </Grid>
      <Grid xs={12} md={7}>
        <Sheet>
          <CardProduct
            product={watch()}
            category={
              categories.find((category) => category._id === watch("type.categoryId"))
                ?.name as string
            }
          />
        </Sheet>
      </Grid>
    </Grid>
  );
}

export default ProductAdd;
