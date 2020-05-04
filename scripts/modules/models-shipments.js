define([
    "modules/api",
    'underscore',
    "modules/backbone-mozu",
    "hyprlive",
    "modules/models-product",
    "modules/models-returns"
], function (api, _, Backbone, Hypr, ProductModels, ReturnModels) {

    var Shipment = Backbone.MozuModel.extend({
        relations: {
            items: Backbone.Collection.extend({
                model: ProductModels.Product
            })
        },
        helpers: ['formatedFulfillmentDate'],
        formatedFulfillmentDate: function() {
            var shippedDate = this.get('fulfillmentDate'),
                options = {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric"
                };

            if (shippedDate) {
                var date = new Date(shippedDate);
                return date.toLocaleDateString("en-us", options);
            }

            return "";
        }
    }),
    ShipmentCollection = Backbone.MozuPagedCollection.extend({
        mozuType: 'shipments',
        defaults: {
            pageSize: 3
        },
        relations: {
            items: Backbone.Collection.extend({
                model: Shipment
            })
        },
        helpers: ['getMoreShipmentItems'],
        set: function(rawData, options, nonAggregateItems){
            if(!nonAggregateItems) {
                if(rawData.items && this.items) {
                    rawData.items = rawData.items.concat(this.items);
                }
            }
            return Backbone.MozuModel.prototype.set.call(this, rawData, options);
        },
        getMoreShipmentItems: function() {
            return this.nextPage();    
        }
    });

    return {
        ShipmentCollection: ShipmentCollection,
        Shipment: Shipment
    };

});