export const transformSocialData = (formDataOrderDto: any) => {
    const {
        name,
        phone,
        products,
        delivery,
        deliveryTime,
        totalPrice,
        sdacha,
        chopsticks,
        comments
      } = formDataOrderDto

        const orderList = products.map((elem: any) => {
            const isWokDescritp = elem.descriptionWok === '' ? "" : `-Лапша: ${elem.descriptionWok}`
            const isPizzazIng = elem.descriptionIngrideents === undefined ? "" : `Доп.Ингидеенты: ${elem.descriptionIngrideents}`
            const isSizedPizza = elem.productSize === undefined ? "" : `-Размер: ${elem.productSize}`
            
if(isSizedPizza === "" && isPizzazIng === "" && isWokDescritp === "") {
return `
-Название: ${elem.product}
-Состав: ${elem.description}    
-Штук: ${elem.count}
-Цена: ${elem.total}
`
} else if(isSizedPizza !== "") {
return `
-Название: ${elem.product}
-Состав: ${elem.description}
-${isSizedPizza}    
-Штук: ${elem.count}
-Цена: ${elem.total}
`
            } else if(isSizedPizza !== "" && isPizzazIng !== "") {
return `
-Название: ${elem.product}
Состав: ${elem.description}
-${isSizedPizza}
-${isPizzazIng}   
-Штук: ${elem.count}
-Цена: ${elem.total}
`
            } else if(isWokDescritp !== "") {
return `
-Название: ${elem.product}
-Состав: ${elem.description}
${isWokDescritp}   
-Штук: ${elem.count}
-Цена: ${elem.total}
`
    }
});
            
        const deliveryInfoTime = () => {
            if(typeof deliveryTime === 'string') {
                return `>Дата готовки: ${deliveryTime}`
            }
            const { dateDelivery, timeDelivery } = deliveryTime;
            return `>Дата готовки/доставки: ${dateDelivery}
             >К какому времени доставить/приготовить: ${timeDelivery}
            `
        };
        const deliveryInfo = () => {
            if(typeof delivery === 'string') {
            return `>Способ получения заказа: ${delivery}`
            }
            
        const {
          formDelivery,
          adress,
          street,
          home,
          apartment,
          podezd,
        //  etag,
        //  kodDveri
        } = delivery;

return `
>Способ получения заказа: ${formDelivery}
>Населенный пункт: ${adress}
>Улица: ${street}
>Номер дома: ${home}
>Номер квартиры: ${apartment} / Подьезд: ${podezd}
`
        };

        let currentDateTime = function (locale: string, prefix: string = '', suffix: string = '') {
            return {
                locale: locale,
                prefix: prefix,
                suffix: suffix,
                date: new Date(),
                options: {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    weekday: 'long',
                    timezone: 'UTC',
                    // hour: 'numeric',
                    // minute: 'numeric',
                    // second: 'numeric',
                },
                result: '',
                getDateString: function () {
                    return this.prefix + this.date.toLocaleString(this.locale, this.options) + this.suffix;
                },
            };
        };


let today = currentDateTime('ru').getDateString();
return `
====
📩НОВЫЙ ЗАКАЗ
${today}
====
Имя: ${name}
Телефон: ${phone} 

>Товары: ${orderList}
${deliveryInfo()}
${deliveryInfoTime()}
>Приборы(палочки): ${chopsticks}
>Сдача: ${sdacha}
>Общая цена к оплате: ${totalPrice}
>Комментарий к заказу: ${comments}
=======
Подтвердить заказ ${phone}
=======
⛔⛔⛔⛔⛔⛔
`
};