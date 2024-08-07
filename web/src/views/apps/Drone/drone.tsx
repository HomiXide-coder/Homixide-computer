import { useEffect, useState } from "react";
import Window from "../../../components/Window/Window";
import Icon from "../../../utils/icon";
import style from "./drone.module.scss";
import { useNavigate } from "react-router-dom";
import { fetchNui } from "~utils/fetchNui";
import { useTranslation } from "react-i18next";
import { DBResponse } from "~types/Global";
import {
  SendErrorNotification,
  SendSuccessNotification,
} from "~utils/notifications";

interface Item {
  id: number;
  name: string;
  displayName: string;
  image: string;
  price: number;
  availability: number;
  quantity?: number;
}

interface CartItems {
  [key: string]: Item;
}
const Drone = () => {
  const { t } = useTranslation();
  const [items, setItems] = useState<CartItems>({});
  const [cartItems, setCartItems] = useState<CartItems>({});
  const navigate = useNavigate();
  const [imageURL, setImageURL] = useState("");

  useEffect(() => {
    fetchNui<CartItems>(
      "fetchDroneItems",
      {},
      {
        1: {
          id: 1,
          name: "item1",
          displayName: "Item 1",
          image: "item1.png",
          price: 100,
          availability: 10,
        },
        2: {
          id: 2,
          name: "item2",
          displayName: "Item 2",
          image: "item2.png",
          price: 200,
          availability: 5,
        },
        3: {
          id: 3,
          name: "item3",
          displayName: "Item 3",
          image: "item3.png",
          price: 300,
          availability: 2,
        },
        4: {
          id: 1,
          name: "item1",
          displayName: "Item 1",
          image: "item1.png",
          price: 100,
          availability: 10,
        },
        5: {
          id: 2,
          name: "item2",
          displayName: "Item 2",
          image: "item2.png",
          price: 200,
          availability: 5,
        },
        6: {
          id: 3,
          name: "item3",
          displayName: "Item 3",
          image: "item3.png",
          price: 300,
          availability: 2,
        },
        7: {
          id: 1,
          name: "item1",
          displayName: "Item 1",
          image: "item1.png",
          price: 100,
          availability: 10,
        },
        8: {
          id: 2,
          name: "item2",
          displayName: "Item 2",
          image: "item2.png",
          price: 200,
          availability: 5,
        },
        9: {
          id: 3,
          name: "item3",
          displayName: "Item 3",
          image: "item3.png",
          price: 300,
          availability: 2,
        },
        10: {
          id: 1,
          name: "item1",
          displayName: "Item 1",
          image: "item1.png",
          price: 100,
          availability: 10,
        },
        11: {
          id: 2,
          name: "item2",
          displayName: "Item 2",
          image: "item2.png",
          price: 200,
          availability: 5,
        },
      }
    )
      .then((data) => {
        setItems(data);
      })
      .catch(() => {
        navigate("/");
      });

    fetchNui<string>("fetchInventoryImagesURL", {}, "https://cdn.example.com")
      .then((data) => {
        setImageURL(data);
      })
      .catch(() => {
        navigate("/");
      });
  }, [navigate]);

  const buyItems = () => {
    fetchNui<DBResponse>("buyDroneItems", cartItems, {
      0: true,
      1: "You have successfully bought the items",
    })
      .then((resp) => {
        if (resp[0] == true && resp[1]) {
          SendSuccessNotification(resp[1]);
        } else if (resp[0] == false && resp[1]) {
          SendErrorNotification(resp[1]);
        }

        setCartItems({});

        fetchNui<CartItems>(
          "fetchDroneItems",
          {},
          {
            1: {
              id: 1,
              name: "item1",
              displayName: "Item 1",
              image: "item1.png",
              price: 100,
              availability: 10,
            },
            2: {
              id: 2,
              name: "item2",
              displayName: "Item 2",
              image: "item2.png",
              price: 200,
              availability: 5,
            },
            3: {
              id: 3,
              name: "item3",
              displayName: "Item 3",
              image: "item3.png",
              price: 300,
              availability: 2,
            },
            4: {
              id: 1,
              name: "item1",
              displayName: "Item 1",
              image: "item1.png",
              price: 100,
              availability: 10,
            },
            5: {
              id: 2,
              name: "item2",
              displayName: "Item 2",
              image: "item2.png",
              price: 200,
              availability: 5,
            },
            6: {
              id: 3,
              name: "item3",
              displayName: "Item 3",
              image: "item3.png",
              price: 300,
              availability: 2,
            },
          }
        )
          .then((data) => {
            setItems(data);
          })
          .catch(() => {
            navigate("/");
          });
      })
      .catch(() => {
        navigate("/");
      });
  };

  return (
    <Window>
      <div className={style.drone}>
        <div className={style.droneStoreInfo}>
          <div className={style.droneStoreInfoHeader}>Exclusive Items</div>
          <div className={style.droneStoreInfoText}>
            These items are only available for a limited time
          </div>
        </div>
        <div className={style.droneWindow}>
          <div className={style.droneStore}>
            {Object.values(items).map(
              (item) =>
                item.availability > 0 && (
                  <div className={style.droneItem} key={item.id}>
                    <div className={style.droneItemHeader}>
                      <div className={style.droneItemPriceCurrency}>
                        {t("coin_name")}
                      </div>
                      <div className={style.droneItemPriceAmount}>
                        {item.price}
                      </div>
                    </div>
                    <img
                      src={imageURL + item.image}
                      alt="Drone-item-img"
                      className={style.droneItemImage}
                    />

                    {cartItems[item.id] && (
                      <div className={style.droneItemControls}>
                        <button
                          className={style.controlMinus}
                          onClick={() => {
                            const newCartItems = { ...cartItems };
                            newCartItems[item.id].quantity = Math.max(
                              1,
                              newCartItems[item.id].quantity! - 1
                            );

                            setCartItems(newCartItems);
                          }}
                        >
                          <Icon id="minus" className={style.icon} />
                        </button>
                        <input
                          type="number"
                          className={style.controlField}
                          value={cartItems[item.id].quantity || 0}
                          onChange={(e) => {
                            const newCartItems = { ...cartItems };
                            newCartItems[item.id].quantity = parseInt(
                              e.target.value
                            );
                            if (
                              newCartItems[item.id].quantity! >
                              item.availability
                            ) {
                              newCartItems[item.id].quantity =
                                item.availability;
                            }
                            if (newCartItems[item.id].quantity! < 1) {
                              newCartItems[item.id].quantity = 1;
                            }
                            setCartItems(newCartItems);
                          }}
                        />
                        <button
                          className={style.controlPlus}
                          onClick={() => {
                            const newCartItems = { ...cartItems };
                            newCartItems[item.id].quantity =
                              (newCartItems[item.id].quantity || 0) + 1;
                            if (
                              newCartItems[item.id].quantity! >
                              item.availability
                            ) {
                              newCartItems[item.id].quantity =
                                item.availability;
                            }
                            setCartItems(newCartItems);
                          }}
                        >
                          <Icon id="plus" className={style.icon} />
                        </button>
                        <button
                          className={style.controlRemove}
                          onClick={() => {
                            const newCartItems = { ...cartItems };
                            delete newCartItems[item.id];
                            setCartItems(newCartItems);
                          }}
                        >
                          <Icon id="cart-remove" className={style.icon} />
                        </button>
                      </div>
                    )}

                    <div className={style.droneItemInfo}>
                      <div className={style.itemText}>{item.displayName}</div>
                      <button
                        className={style.cartIcon}
                        onClick={() => {
                          if (!cartItems[item.id]) {
                            setCartItems({
                              ...cartItems,
                              [item.id]: {
                                ...item,
                                quantity: 1,
                              },
                            });
                          }
                        }}
                      >
                        <Icon id="cart" className={style.icon} />
                      </button>
                    </div>
                  </div>
                )
            )}
          </div>
          <div className={style.droneCart}>
            <div className={style.droneCartHeader}>Your Cart</div>
            {Object.values(cartItems).length > 0 ? (
              <>
                <div className={style.droneCartItems}>
                  {Object.values(cartItems).map((item) => (
                    <div className={style.droneCartItem} key={item.id}>
                      <img
                        src={imageURL + item.image}
                        alt="Drone-item-img"
                        className={style.droneCartItemImage}
                      />
                      <div className={style.cartItemName}>
                        {item.displayName}
                      </div>
                      <div className={style.cartItemQuantity}>
                        <div className={style.quantity}>
                          <Icon id="amount" className={style.quantityIcon} />
                          {item.quantity}
                        </div>
                        <div className={style.price}>
                          <Icon id="price" className={style.priceIcon} />
                          {item.price * item.quantity!}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className={style.droneCartTotal}>
                  <span>Total Price:</span>
                  <span>
                    {Object.values(cartItems).reduce(
                      (acc, item) => acc + item.price * (item.quantity || 0),
                      0
                    )}{" "}
                    BDCOIN
                  </span>
                </div>
                <button className={style.droneCartCheckout} onClick={buyItems}>
                  BUY
                </button>
              </>
            ) : (
              <div className={style.emptyCart}>
                <Icon id="sademoji" className={style.icon} />
                <div className={style.droneCartEmpty}>
                  You cart is empty. Shop some products now, so I'm not sad...
                  :/
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </Window>
  );
};

export default Drone;
