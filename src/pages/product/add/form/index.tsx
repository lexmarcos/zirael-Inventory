import {
  Autocomplete,
  Button,
  CircularProgress,
  Divider,
  FormControl,
  FormLabel,
  Input,
  List,
  ListItem,
  Option,
  Select,
  Sheet,
  Textarea,
  Typography,
} from "@mui/joy";
import React, { useState } from "react";
import { ICategories } from "@/pages/api/categories/types";
import { useMutation, useQuery } from "@tanstack/react-query";
import { getCategories } from "@/services/api/categories";
import { IBrand } from "@/pages/api/brands/types";
import { getBrands } from "@/services/api/brands";
import {
  Control,
  Controller,
  UseFormHandleSubmit,
  UseFormSetValue,
  UseFormWatch,
} from "react-hook-form";
import { getProductsTypes, insertProduct } from "@/services/api/products";
import { normalizedWeightsAndVolumes } from "@/utils/measurements";
import { useDebounce } from "use-debounce";
import { IAttributeOfProductType, IProductType } from "@/pages/api/products/type/types";
import { IFormProductAdd, ITypeOfProduct } from "./types";
import { styles } from "./styles";
import CurrencyField from "@/components/currencyInput";

function FormAddProduct({
  control,
  handleSubmit,
  watch,
  setValue,
}: {
  control: Control<IFormProductAdd, any>;
  handleSubmit: UseFormHandleSubmit<IFormProductAdd>;
  watch: UseFormWatch<IFormProductAdd>;
  setValue: UseFormSetValue<IFormProductAdd>;
}) {
  const [brands, setBrands] = useState<IBrand[]>([]);
  const [attributesToShow, setAttributesToShow] = useState<IAttributeOfProductType[]>([]);
  const [productTypes, setProductTypes] = useState<ITypeOfProduct[]>([]);

  const { isFetchedAfterMount: isFetchedAfterMountBrands } = useQuery(["brands"], getBrands, {
    onSuccess: ({ data }: { data: IBrand[] }) => {
      setBrands(data);
    },
  });

  const [nameDebounced] = useDebounce(watch("name"), 500);

  const productMutation = useMutation(["products"], insertProduct, {
    onSuccess: ({ data }) => {
      console.log(data);
    },
  });

  const addNewAttribute = (key: string, label: string, value: string | number | boolean) => {
    // Obter o valor atual de attributes
    const currentAttributes = watch("attributes");

    // Criar um novo objeto attributes com a chave e valor adicionados
    const updatedAttributes = {
      ...currentAttributes,
      [key]: {
        value,
        label,
      },
    };

    // Atualizar o valor de attributes no useForm
    setValue("attributes", updatedAttributes);
  };

  useQuery(["productTypeByProductName", nameDebounced], () => getProductsTypes(nameDebounced), {
    onSuccess: ({ data }: { data: IProductType[] }) => {
      if (data.length === 1) {
        setValue("type", {
          value: data[0]._id as string,
          label: data[0].name,
          categoryId: data[0].categoryId,
        });
        data[0].attributes.map((attribute) => {
          addNewAttribute(attribute.key, attribute.label, attribute.defaultValue);
        });
        setAttributesToShow(data[0].attributes);
      }
    },
  });

  useQuery(["productType"], () => getProductsTypes(), {
    onSuccess: ({ data }: { data: IProductType[] }) => {
      setProductTypes(
        data.map((productType) => ({
          label: productType.name,
          value: productType._id,
          categoryId: productType.categoryId,
        }))
      );
    },
  });

  const onSubmit = (data: any) => productMutation.mutate(data);
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Sheet sx={styles.form}>
        <FormControl>
          <FormLabel>Nome</FormLabel>
          <Controller
            name="name"
            control={control}
            rules={{ required: true }}
            render={({ field }) => <Input placeholder="Ex: Hidratante Tododia" {...field} />}
          />
        </FormControl>
        <FormControl>
          <FormLabel>Tipo do produto</FormLabel>
          <Controller
            name="type"
            control={control}
            rules={{ required: true }}
            render={({ field: { value, onChange } }) => (
              <Autocomplete
                value={value}
                onChange={(e, newValue) => onChange(newValue)}
                placeholder="Ex: Hidratante"
                options={productTypes}
              />
            )}
          />
        </FormControl>
        <FormControl>
          <FormLabel>Marca</FormLabel>
          <Controller
            name="brand"
            control={control}
            rules={{ required: true }}
            render={({ field: { onChange } }) => (
              <Select
                onChange={(e, newValue) => onChange(newValue)}
                placeholder="Selecione uma marca"
                disabled={!isFetchedAfterMountBrands}
                endDecorator={
                  !isFetchedAfterMountBrands ? <CircularProgress variant="soft" size="sm" /> : null
                }
              >
                {brands.map((brand) => (
                  <Option key={brand._id as string} value={brand._id}>
                    {brand.name}
                  </Option>
                ))}
              </Select>
            )}
          />
        </FormControl>
        <FormControl>
          <FormLabel>Descrição</FormLabel>
          <Controller
            name="description"
            control={control}
            rules={{ required: true }}
            render={({ field }) => (
              <Textarea
                placeholder="Ex: Hidratante encorpado com bastante cheiro de amnedoas"
                {...field}
              />
            )}
          />
        </FormControl>
        <FormControl>
          <FormLabel>Preço</FormLabel>

          <Controller
            name="price"
            control={control}
            rules={{ required: true }}
            render={({ field: { onChange, value } }) => (
              <CurrencyField onValueChange={(value) => onChange(value)} />
            )}
          />
        </FormControl>
        <Typography level="h4" component="h1">
          <b>Atributos</b>
        </Typography>
        {attributesToShow.length > 0 && (
          <div>
            <Controller
              name="attributes.weightOrVolume.value"
              control={control}
              rules={{ required: true }}
              render={({ field: { onChange, value } }) => (
                <Input
                  value={value as number}
                  onChange={(e) => onChange(parseFloat(e.target.value))}
                  placeholder="Amount"
                  sx={{ minWidth: "100%" }}
                  endDecorator={
                    <Controller
                      name="attributes.measure.value"
                      control={control}
                      rules={{ required: true }}
                      render={({ field: { onChange, value } }) => (
                        <React.Fragment>
                          <Divider orientation="vertical" />
                          <Select
                            value={value}
                            onChange={(e, newValue) => onChange(newValue)}
                            variant="plain"
                            sx={{ mr: -1.5, "&:hover": { bgcolor: "transparent" } }}
                          >
                            <List>
                              {normalizedWeightsAndVolumes.map((item) => (
                                <React.Fragment key={item.name}>
                                  <ListItem variant="soft">
                                    <Typography
                                      level="body3"
                                      textTransform="uppercase"
                                      letterSpacing="md"
                                    >
                                      {item.name}
                                    </Typography>
                                  </ListItem>
                                  {item.options.map((item) => (
                                    <Option value={item.abbreviation} key={item.abbreviation}>
                                      {item.symbol}
                                    </Option>
                                  ))}
                                </React.Fragment>
                              ))}
                            </List>
                          </Select>
                        </React.Fragment>
                      )}
                    />
                  }
                />
              )}
            />
          </div>
        )}
        {attributesToShow.map((attribute) =>
          attribute.key === "weightOrVolume" || attribute.key === "measure" ? null : (
            <FormControl key={attribute.key}>
              <FormLabel>{attribute.label}</FormLabel>

              <Controller
                name={`attributes.${attribute.key}.value`}
                control={control}
                rules={{ required: true }}
                render={({ field: { value, onChange } }) => (
                  <Input
                    value={value as string | number}
                    onChange={(e) => onChange(e.target.value)}
                    placeholder="Ex: Hidratante Tododia"
                  />
                )}
              />
            </FormControl>
          )
        )}
        <div>
          <Button type="submit">Salvar</Button>
        </div>
      </Sheet>
    </form>
  );
}

export default FormAddProduct;
