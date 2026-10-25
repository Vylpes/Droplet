import type { ReactNode } from 'react'
import Nav from 'react-bootstrap/Nav'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import { Link } from 'react-router'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlusSquare } from '@fortawesome/free-solid-svg-icons'
import type { StatusTab } from './purchaseStatus'

export interface StatusTabListProps {
    title: string
    basePath: string
    activeStatus: string
    tabs: StatusTab[]
    onNew?: () => void
    newLabel?: string
    children: ReactNode
}

/**
 * Reusable status-tab list shell for purchase/listing/order domains (#354).
 * Consolidates the five near-duplicate Pug list templates into one page.
 */
export function StatusTabList({
    title,
    basePath,
    activeStatus,
    tabs,
    onNew,
    newLabel = 'New',
    children,
}: StatusTabListProps) {
    return (
        <>
            <Row>
                <Col>
                    <h1>{title}</h1>
                </Col>
                {onNew ? (
                    <Col>
                        <div className="d-grid gap-2 d-md-flex justify-content-md-end">
                            <button
                                type="button"
                                className="btn text-primary"
                                onClick={onNew}
                            >
                                <FontAwesomeIcon icon={faPlusSquare} />
                                <span className="ms-1">{newLabel}</span>
                            </button>
                        </div>
                    </Col>
                ) : null}
            </Row>
            <Nav variant="tabs" className="mb-3">
                {tabs.map((tab) => (
                    <Nav.Item key={tab.slug}>
                        <Nav.Link
                            as={Link}
                            to={`${basePath}/${tab.slug}`}
                            active={activeStatus === tab.slug}
                        >
                            {tab.label}
                        </Nav.Link>
                    </Nav.Item>
                ))}
            </Nav>
            {children}
        </>
    )
}
