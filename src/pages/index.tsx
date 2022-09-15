import { GetStaticProps } from "next"
import Stripe from "stripe"
import { stripe } from "../lib/stripe"
import axios from 'axios'

interface Props {
  products: {
    id: string;
    name: string;
    images: string[],
    descriptions: string | null;
    price: {
      id: string;
      amount: number | null;
    }
  }[]
}

export default function Home({ products }: Props){
  async function handleClickBuyCoffee(id: string){
    try {
      const response = await axios.post("/api/create-checkout", {
        priceId: id
      })

      if (response.data.url) {
        window.location.href = response.data.url
      }
    }catch(err){
      console.log({ err })
      alert("erro ao tentar acessar a compra")
    }
  }

  return (
    <div className="w-screen h-screen flex flex-col items-center justify-center">
      <div className="max-w-[1000px] flex p-10 gap-4 flex-wrap">
        {products.map(product => (
          <span key={product.id} className="border">
            <img src={product.images[0]} className="w-40 h-40" />

            <span className="w-full">
              <button className="p-4 w-full bg-slate-400 hover:bg-stone-500 transition-colors" onClick={() => handleClickBuyCoffee(product.price.id)}>
                {product.price.amount}{" - "}
                Sold now
              </button>
            </span>
          </span>
        ))}
      </div>
    </div>
  )
}

export const getStaticProps: GetStaticProps = async () => {
  const response = await stripe.products.list({
    expand: ["data.default_price"],
  })

  const products = response.data.map(element => {
    const price = element.default_price as Stripe.Price;

    return {
      id: element.id,
      name: element.name,
      images: element.images,
      descriptions: element.description,
      price: {
        id: price.id,
        amount: price.unit_amount ? new Intl.NumberFormat("pt-BR", {style: "currency", currency: "BRL"}).format(price.unit_amount / 100) : null,
      }
    }
  })

  return {
    props: {
      products,
    },
  }
}