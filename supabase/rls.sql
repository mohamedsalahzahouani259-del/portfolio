-- ====================================================================
-- FACTURATN - ROW LEVEL SECURITY (RLS) POLICIES
-- Multi-tenant isolation ensuring no organization can see another's data
-- ====================================================================

ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE organization_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE tax_rates ENABLE ROW LEVEL SECURITY;
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoice_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE quotes ENABLE ROW LEVEL SECURITY;
ALTER TABLE quote_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE expenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Helper function to check if current user is member of an organization
CREATE OR REPLACE FUNCTION user_in_organization(org_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM organization_members
        WHERE organization_members.organization_id = org_id
        AND organization_members.user_id = auth.uid()
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Organization access
CREATE POLICY "Users can view organizations they belong to"
    ON organizations FOR SELECT
    USING (user_in_organization(id));

CREATE POLICY "Users can update their organizations if owner/admin"
    ON organizations FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM organization_members
            WHERE organization_members.organization_id = id
            AND organization_members.user_id = auth.uid()
            AND organization_members.role IN ('owner', 'admin')
        )
    );

-- Clients policy
CREATE POLICY "Clients isolation"
    ON clients FOR ALL
    USING (user_in_organization(organization_id))
    WITH CHECK (user_in_organization(organization_id));

-- Products policy
CREATE POLICY "Products isolation"
    ON products FOR ALL
    USING (user_in_organization(organization_id))
    WITH CHECK (user_in_organization(organization_id));

-- Invoices policy
CREATE POLICY "Invoices isolation"
    ON invoices FOR ALL
    USING (user_in_organization(organization_id))
    WITH CHECK (user_in_organization(organization_id));

-- Invoice items policy
CREATE POLICY "Invoice items isolation"
    ON invoice_items FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM invoices
            WHERE invoices.id = invoice_items.invoice_id
            AND user_in_organization(invoices.organization_id)
        )
    );

-- Quotes policy
CREATE POLICY "Quotes isolation"
    ON quotes FOR ALL
    USING (user_in_organization(organization_id))
    WITH CHECK (user_in_organization(organization_id));

-- Quote items policy
CREATE POLICY "Quote items isolation"
    ON quote_items FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM quotes
            WHERE quotes.id = quote_items.quote_id
            AND user_in_organization(quotes.organization_id)
        )
    );

-- Payments policy
CREATE POLICY "Payments isolation"
    ON payments FOR ALL
    USING (user_in_organization(organization_id))
    WITH CHECK (user_in_organization(organization_id));

-- Expenses policy
CREATE POLICY "Expenses isolation"
    ON expenses FOR ALL
    USING (user_in_organization(organization_id))
    WITH CHECK (user_in_organization(organization_id));

-- Notifications policy
CREATE POLICY "Notifications isolation"
    ON notifications FOR ALL
    USING (user_in_organization(organization_id))
    WITH CHECK (user_in_organization(organization_id));
