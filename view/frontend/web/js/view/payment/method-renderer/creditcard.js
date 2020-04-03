/**
 * Shop System Plugins:
 * - Terms of Use can be found under:
 * https://github.com/wirecard/magento2-ee/blob/master/_TERMS_OF_USE
 * - License can be found under:
 * https://github.com/wirecard/magento2-ee/blob/master/LICENSE
 */

/* globals WPP */

define(
    [
        "Wirecard_ElasticEngine/js/view/payment/method-renderer/default",
        "Wirecard_ElasticEngine/js/view/payment/seamless-vault-enabler",
        "Wirecard_ElasticEngine/js/view/payment/method-renderer/seamlessformutils",
        "Wirecard_ElasticEngine/js/view/payment/method-renderer/constants",
        "Magento_Checkout/js/model/quote",
        "mage/url"
    ],
    function (ParentPaymentMethod, VaultEnabler, SeamlessCreditCardUtils, SeamlessCreditCardConstants, quote, url) {
        "use strict";
        return ParentPaymentMethod.extend({
            seamlessResponse: null,
            defaults: {
                template: "Wirecard_ElasticEngine/payment/method-creditcard",
                redirectAfterPlaceOrder: false
            },

            previousBillingAddress: quote.billingAddress(),
            newBillingAddress: null,
          
            /**
             * @returns {exports.initialize}
             */
            initialize: function () {
                this._super();
                if (!localStorage.getItem(SeamlessCreditCardConstants.localStorage.counterKey)) {
                    localStorage.setItem(SeamlessCreditCardConstants.localStorage.counterKey, SeamlessCreditCardConstants.localStorage.initValue);
                }
                let self = this;
                quote.billingAddress.subscribe(function () {
                    let currentBillingAddress = quote.billingAddress();
                    if ((JSON.stringify(self.previousBillingAddress) !== JSON.stringify(currentBillingAddress)) &&
                        (currentBillingAddress !== null)
                    ) {
                        self.newBillingAddress = currentBillingAddress;
                        self.seamlessFormInit();
                        self.newBillingAddress = null;
                        self.previousBillingAddress = currentBillingAddress;
                    }
                });
                return this;
            },

            /**
             * Init config
             */
            initClientConfig: function () {
                this._super();
            },

            /**
             * Get the vault code
             * @returns {String}
             */
            getVaultCode: function () {
                return window.checkoutConfig.payment[this.getCode()].vaultCode;
            },

            /**
             * Get the form submit button id
             */
            getSubmitBtnId: function() {
                return SeamlessCreditCardConstants.button.submitOrder;
            },

            /**
             * Check if vault is enabled
             * @returns {Boolean}
             */
            isVaultEnabled: function () {
                return this.vaultEnabler.isVaultEnabled();
            },

            /**
             * Initialize the vault enabler
             */
            seamlessFormInitVaultEnabler: function () {
                this.vaultEnabler = new VaultEnabler();
                this.vaultEnabler.setPaymentCode(this.getVaultCode());
            },
          
            /**
             * Get the form id string
             * return {String}
             */
            getFormId: function() {
                return this.getCode() + SeamlessCreditCardConstants.settings.formIdSuffix;
            },

            /**
             * Constructs the ui initialization data object
             * return {Object}
             */
            getUiInitData() {
                let payload = {
                    txtype: SeamlessCreditCardConstants.data.wppTxType
                };
                if (this.newBillingAddress !== null) {
                    payload.billing_address = JSON.stringify(this.newBillingAddress)
                }
                return payload;
            },

            /**
             * Get the data
             * return {Object}
             */
            getData: function () {
                //this payload is needed in this format from magento
                /*eslint-disable */
                let data =  {
                    method: this.getCode(),
                    po_number: null,
                    additional_data: {
                        is_active_payment_token_enabler: false,
                    }
                };
                /*eslint-enable */

                this.vaultEnabler.visitAdditionalData(data);

                return data;
            },

            /**
             * Handle the selected payment method
             */
            selectPaymentMethod: function() {
                this._super();
                return true;
            },

            /**
             * Handle form initialization
             */
            seamlessFormInit: function () {
                SeamlessCreditCardUtils.seamlessFormInit.call(this);
            },

            /**
             * Prepare order to be placed
             * @param {Object} data
             * @param {Object} event
             */
            placeSeamlessOrder: function (data, event) {
                SeamlessCreditCardUtils.placeSeamlessOrder.call(this, event, this.getFormId);
            },

            /**
             * Handle post order creation operationsgetPaymentPageScript
             */
            afterPlaceOrder: function () {
                SeamlessCreditCardUtils.afterPlaceOrder.call(this);
            },

            /**
             * Handle 3Ds credit card transactions within callback
             * @param response
             */
            processThreeDPayment: function (response) {
                SeamlessCreditCardUtils.processThreeDPayment.call(this,response);
            }
        });
    }
);
