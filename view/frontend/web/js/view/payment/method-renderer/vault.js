/**
 * Shop System Plugins - Terms of Use
 *
 * The plugins offered are provided free of charge by Wirecard AG and are explicitly not part
 * of the Wirecard AG range of products and services.
 *
 * They have been tested and approved for full functionality in the standard configuration
 * (status on delivery) of the corresponding shop system. They are under General Public
 * License Version 3 (GPLv3) and can be used, developed and passed on to third parties under
 * the same terms.
 *
 * However, Wirecard AG does not provide any guarantee or accept any liability for any errors
 * occurring when used in an enhanced, customized shop system configuration.
 *
 * Operation in an enhanced, customized configuration is at your own risk and requires a
 * comprehensive test phase by the user of the plugin.
 *
 * Customers use the plugins at their own risk. Wirecard AG does not guarantee their full
 * functionality neither does Wirecard AG assume liability for any disadvantages related to
 * the use of the plugins. Additionally, Wirecard AG does not guarantee the full functionality
 * for customized shop systems or installed plugins of other vendors of plugins within the same
 * shop system.
 *
 * Customers are responsible for testing the plugin's functionality before starting productive
 * operation.
 *
 * By installing the plugin into the shop system the customer agrees to these terms of use.
 * Please do not use the plugin if you do not agree to these terms of use!
 */

define([
    'jquery',
    'Magento_Vault/js/view/payment/method-renderer/vault',
    'mage/url'
], function ($, VaultComponent, url) {
    'use strict';

    return VaultComponent.extend({
        defaults: {
            template: 'Magento_Vault/payment/form'
        },
        /**
         * Get last 4 digits of card
         * @returns {String}
         */
        getMaskedCard: function () {
            return this.details.maskedCC;
        },

        /**
         * Get expiration date
         * @returns {String}
         */
        getExpirationDate: function () {
            return this.details.expirationDate;
        },

        /**
         * Get card type
         * @returns {String}
         */
        getCardType: function () {
            return this.details.type;
        },

        /**
         * @returns {String}
         */
        getToken: function () {
            return this.publicHash;
        }/*,

        placeOrder: function () {
            console.log(this.getToken());

            $.get(url.build("wirecard_elasticengine/frontend/callback"), function (data) {
                console.log("data:");
                console.log(data);
                if (data['form-url']) {
                    var form = $('<form />', {action: data['form-url'], method: data['form-method']});

                    for (var i = 0; i < data['form-fields'].length; i++) {
                        form.append($('<input />', {
                            type: 'hidden',
                            name: data['form-fields'][i]['key'],
                            value: data['form-fields'][i]['value']
                        }));
                    }
                    form.appendTo('body').submit();
                } else {
                    window.location.replace(data['redirect-url']);
                }
            });
        }*/
    });
});