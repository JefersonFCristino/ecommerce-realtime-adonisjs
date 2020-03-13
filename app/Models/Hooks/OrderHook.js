'use strict'

const OrderHook = (exports = module.exports = {})

OrderHook.updateValues = async model => {
  model.$sideLoaded.subtotal = await model.items().getSum('subtotal')

  // qty_items = não pode haver um nome que seja igual a um relacionamento
  model.$sideLoaded.qty_items = await model.items().getSum('quantity')

  model.$sideLoaded.discount = await model.discounts().getSum('discount')

  model.total = model.$sideLoaded.subtotal - model.$sideLoaded.discount
}

// Vai receber um array com uma list de models
OrderHook.updateCollectionsValues = async models => {
  for (let model of models) {
    model = await OrderHook.updateValues(model)
  }
}
