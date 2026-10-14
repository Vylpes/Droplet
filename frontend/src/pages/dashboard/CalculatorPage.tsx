import { useState } from 'react'
import Button from 'react-bootstrap/Button'
import Card from 'react-bootstrap/Card'
import Col from 'react-bootstrap/Col'
import Form from 'react-bootstrap/Form'
import Row from 'react-bootstrap/Row'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheckSquare } from '@fortawesome/free-solid-svg-icons'
import { useForm } from 'react-hook-form'
import { FormField } from '../../components/form'
import {
    calculateEbayFees,
    formatMoney,
    type FeesCalculatorResult,
} from './feesCalculator'

interface CalculatorFormValues {
    itemBuyPrice: string
    itemSellPrice: string
    shippingCostToBuyer: string
    actualShippingCost: string
    feesRate: string
}

function toNumber(value: string): number {
    return Number(value)
}

export function CalculatorPage() {
    const [result, setResult] = useState<FeesCalculatorResult | null>(null)
    const { control, handleSubmit } = useForm<CalculatorFormValues>({
        defaultValues: {
            itemBuyPrice: '',
            itemSellPrice: '',
            shippingCostToBuyer: '',
            actualShippingCost: '',
            feesRate: '10',
        },
    })

    const onSubmit = handleSubmit((values) => {
        setResult(
            calculateEbayFees({
                itemBuyPrice: toNumber(values.itemBuyPrice),
                itemSellPrice: toNumber(values.itemSellPrice),
                shippingCostToBuyer: toNumber(values.shippingCostToBuyer),
                actualShippingCost: toNumber(values.actualShippingCost),
                feesRatePercent: toNumber(values.feesRate),
            })
        )
    })

    return (
        <>
            <Row className="mt-3">
                <Col>
                    <h1>Calculator</h1>
                </Col>
            </Row>
            <Row className="mt-3">
                <Col md={4}>
                    <Card>
                        <Card.Header>eBay Fees</Card.Header>
                        <Card.Body>
                            <Form onSubmit={onSubmit} noValidate>
                                <FormField
                                    control={control}
                                    name="itemBuyPrice"
                                    label="Item Buy Price"
                                    type="number"
                                    step=".01"
                                />
                                <FormField
                                    control={control}
                                    name="itemSellPrice"
                                    label="Item Sell Price"
                                    type="number"
                                    step=".01"
                                />
                                <FormField
                                    control={control}
                                    name="shippingCostToBuyer"
                                    label="Shipping Cost To Buyer"
                                    type="number"
                                    step=".01"
                                />
                                <FormField
                                    control={control}
                                    name="actualShippingCost"
                                    label="Actual Shipping Cost"
                                    type="number"
                                    step=".01"
                                />
                                <FormField
                                    control={control}
                                    name="feesRate"
                                    label="Fees Rate"
                                    type="number"
                                    step=".1"
                                />
                                <Form.Group>
                                    <Button variant="primary" type="submit">
                                        <FontAwesomeIcon icon={faCheckSquare} />
                                        <span className="ms-1">Calculate</span>
                                    </Button>
                                </Form.Group>
                            </Form>
                            <hr />
                            <div>
                                <div className="container">
                                    <p className="mb-0 text-secondary">
                                        Total Fees
                                    </p>
                                    <p>
                                        {result
                                            ? formatMoney(result.totalFees)
                                            : null}
                                    </p>
                                </div>
                                <div className="container">
                                    <p className="mb-0 text-secondary">
                                        Profit
                                    </p>
                                    <p>
                                        {result
                                            ? formatMoney(result.profit)
                                            : null}
                                    </p>
                                </div>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </>
    )
}
