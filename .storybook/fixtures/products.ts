import { Field, FieldSet, TypedField } from "../../src";

export const FIXTURE_PRODUCTS = [
  {
    id: 1,
    name: "Wireless Headphones",
    description: "High-quality wireless headphones with noise cancellation.",
    url: "https://www.example.com/products/1",
    price: 99.99,
    stock: 50,
    category: "Electronics",
    isAvailable: true,
    releaseDate: "2023-01-15" // YYYY-MM-DD format
  },
  {
    id: 2,
    name: "Smartwatch",
    description: "A smartwatch with fitness tracking and notifications.",
    url: "https://www.example.com/products/2",
    price: 199.99,
    stock: 30,
    category: "Wearables",
    isAvailable: false,
    releaseDate: "2023-02-20"
  },
  {
    id: 3,
    name: "Laptop Stand",
    description: "An ergonomic laptop stand to improve posture while working.",
    url: "https://www.example.com/products/3",
    price: 39.99,
    stock: 100,
    category: "Accessories",
    isAvailable: true,
    releaseDate: "2023-03-10"
  },
  {
    id: 4,
    name: "Bluetooth Speaker",
    description: "Portable Bluetooth speaker with rich sound quality.",
    url: "https://www.example.com/products/4",
    price: 49.99,
    stock: 75,
    category: "Audio",
    isAvailable: true,
    releaseDate: "2023-04-25"
  },
  {
    id: 5,
    name: "4K Monitor",
    description: "High-resolution 4K monitor for stunning visuals.",
    url: "https://www.example.com/products/5",
    price: 299.99,
    stock: 20,
    category: "Monitors",
    isAvailable: false,
    releaseDate: "2023-05-15"
  },
  {
    id: 6,
    name: "Wireless Mouse",
    description: "Ergonomic wireless mouse with customizable buttons.",
    url: "https://www.example.com/products/6",
    price: 29.99,
    stock: 150,
    category: "Accessories",
    isAvailable: true,
    releaseDate: "2023-06-30"
  },
  {
    id: 7,
    name: "Gaming Keyboard",
    description: "Mechanical gaming keyboard with RGB lighting.",
    url: "https://www.example.com/products/7",
    price: 89.99,
    stock: 60,
    category: "Gaming",
    isAvailable: false,
    releaseDate: "2023-07-18"
  },
  {
    id: 8,
    name: "External Hard Drive",
    description: "1TB external hard drive for data storage.",
    url: "https://www.example.com/products/8",
    price: 69.99,
    stock: 40,
    category: "Storage",
    isAvailable: true,
    releaseDate: "2023-08-05"
  },
  {
    id: 9,
    name: "Phone Case",
    description: "Durable phone case with shock absorption.",
    url: "https://www.example.com/products/9",
    price: 19.99,
    stock: 200,
    category: "Accessories",
    isAvailable: true,
    releaseDate: "2023-09-12"
  },
  {
    id: 10,
    name: "Smart TV",
    description:
      "65-inch smart TV with 4K resolution and streaming capabilities.",
    url: "https://www.example.com/products/10",
    price: 599.99,
    stock: 10,
    category: "Electronics",
    isAvailable: false,
    releaseDate: "2023-10-01"
  }
];

export const FIXTURE_PRODUCT = FIXTURE_PRODUCTS[0];
export type TYPE_FIXTURE_PRODUCT = typeof FIXTURE_PRODUCT;

export const FIXTURE_PRODUCT_CATEGORY_OPTIONS = [
  { label: "Electronics", value: "Electronics" },
  { label: "Wearables", value: "Wearables" },
  { label: "Accessories", value: "Accessories" },
  { label: "Audio", value: "Audio" },
  { label: "Monitors", value: "Monitors" },
  { label: "Gaming", value: "Gaming" },
  { label: "Storage", value: "Storage" }
];

export const FIXTURE_PRODUCT_FIELDS: Array<
  Field<TYPE_FIXTURE_PRODUCT> | TypedField<TYPE_FIXTURE_PRODUCT>
> = Object.keys(FIXTURE_PRODUCT).map((f) => {
  const field = f as keyof typeof FIXTURE_PRODUCT;
  switch (field) {
    case "category":
      return {
        name: field,
        type: "string",
        options: FIXTURE_PRODUCT_CATEGORY_OPTIONS,
      };
    case "name":
    case "url":
      return { name: field, type: "string", required: true };
    case "releaseDate":
      return { name: field, type: "date" };
    default:
      return field;
  }
});

export const FIXTURE_PRODUCT_FIELDSETS: FieldSet<typeof FIXTURE_PRODUCT>[] = [
  [
    "Information",
    {
      span: 12,
      titleSpan: 12,
      fields: ["id"]
    }
  ],
  [
    "",
    {
      fields: [
        "name",
        "description",
        {
          name: "category",
          type: "string",
          options: FIXTURE_PRODUCT_CATEGORY_OPTIONS
        },
        { name: "url", type: "string", required: true },
        { name: "releaseDate", type: "date" }
      ],
      span: 12,
      colSpan: 6
    }
  ],

  [
    "Availability",
    {
      fields: ["isAvailable", "stock"],
      span: 12,
      colSpan: 6
    }
  ],
  [
    "More",
    {
      fields: ["price", "description"],
      span: 12,
      colSpan: 6,
      titleSpan: 12
    }
  ]
];
