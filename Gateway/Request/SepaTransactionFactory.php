<?php
/**
 * Shop System Plugins - Terms of Use
 *
 * The plugins offered are provided free of charge by Wirecard Central Eastern Europe GmbH
 * (abbreviated to Wirecard CEE) and are explicitly not part of the Wirecard CEE range of
 * products and services.
 *
 * They have been tested and approved for full functionality in the standard configuration
 * (status on delivery) of the corresponding shop system. They are under General Public
 * License Version 3 (GPLv3) and can be used, developed and passed on to third parties under
 * the same terms.
 *
 * However, Wirecard CEE does not provide any guarantee or accept any liability for any errors
 * occurring when used in an enhanced, customized shop system configuration.
 *
 * Operation in an enhanced, customized configuration is at your own risk and requires a
 * comprehensive test phase by the user of the plugin.
 *
 * Customers use the plugins at their own risk. Wirecard CEE does not guarantee their full
 * functionality neither does Wirecard CEE assume liability for any disadvantages related to
 * the use of the plugins. Additionally, Wirecard CEE does not guarantee the full functionality
 * for customized shop systems or installed plugins of other vendors of plugins within the same
 * shop system.
 *
 * Customers are responsible for testing the plugin's functionality before starting productive
 * operation.
 *
 * By installing the plugin into the shop system the customer agrees to these terms of use.
 * Please do not use the plugin if you do not agree to these terms of use!
 */

namespace Wirecard\ElasticEngine\Gateway\Request;

use Magento\Framework\Locale\ResolverInterface;
use Magento\Framework\UrlInterface;
use Magento\Payment\Gateway\ConfigInterface;
use Magento\Payment\Gateway\Data\PaymentDataObjectInterface;
use Magento\Store\Model\StoreManagerInterface;
use Wirecard\PaymentSdk\Exception\MandatoryFieldMissingException;
use Wirecard\PaymentSdk\Transaction\SepaTransaction;
use Wirecard\PaymentSdk\Transaction\Transaction;

/**
 * Class SepaTransactionFactory
 * @package Wirecard\ElasticEngine\Gateway\Request
 */
class SepaTransactionFactory extends TransactionFactory
{
    /**
     * @var PayPalTransaction
     */
    protected $transaction;

    /**
     * @var AccountHolderFactory
     */
    private $accountHolderFactory;

    /**
     * @var ConfigInterface
     */
    private $methodConfig;

    /**
     * @var StoreManagerInterface
     */
    private $storeManager;

    /**
     * PayPalTransactionFactory constructor.
     * @param UrlInterface $urlBuilder
     * @param ResolverInterface $resolver
     * @param StoreManagerInterface $storeManager
     * @param Transaction $transaction
     * @param AccountHolderFactory $accountHolderFactory
     * @param ConfigInterface $methodConfig
     */
    public function __construct(
        UrlInterface $urlBuilder,
        ResolverInterface $resolver,
        StoreManagerInterface $storeManager,
        Transaction $transaction,
        AccountHolderFactory $accountHolderFactory,
        ConfigInterface $methodConfig
    ) {
        parent::__construct($urlBuilder, $resolver, $transaction);

        $this->storeManager = $storeManager;
        $this->accountHolderFactory = $accountHolderFactory;
        $this->methodConfig = $methodConfig;
    }

    /**
     * @param array $commandSubject
     * @return Transaction
     * @throws \InvalidArgumentException
     * @throws MandatoryFieldMissingException
     */
    public function create($commandSubject)
    {
        parent::create($commandSubject);

        /** @var PaymentDataObjectInterface $payment */
        $payment = $commandSubject[self::PAYMENT];
        $order = $payment->getOrder();
        $billingAddress = $order->getBillingAddress();

        $this->transaction->setAccountHolder($this->accountHolderFactory->create($billingAddress));
        $this->transaction->setShipping($this->accountHolderFactory->create($order->getShippingAddress()));
        $this->transaction->setOrderNumber($this->orderId);
        $this->transaction->setOrderDetail(sprintf(
            '%s %s %s',
            $billingAddress->getEmail(),
            $billingAddress->getFirstname(),
            $billingAddress->getLastname()
        ));

        if ($this->methodConfig->getValue('send_descriptor')) {
            $this->transaction->setDescriptor(sprintf('%s %s',
                substr($this->storeManager->getStore()->getName(), 0, 9),
                $this->orderId
            ));
        }

        return $this->transaction;
    }
}
