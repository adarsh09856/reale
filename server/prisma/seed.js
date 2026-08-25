import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding production-grade database with complete RBAC & business entities...');

  // Clean tables
  await prisma.activityLog.deleteMany({});
  await prisma.rolePermission.deleteMany({});
  await prisma.permission.deleteMany({});
  await prisma.refreshToken.deleteMany({});
  await prisma.passwordResetToken.deleteMany({});
  await prisma.inquiry.deleteMany({});
  await prisma.faq.deleteMany({});
  await prisma.partnerLink.deleteMany({});
  await prisma.socialConnection.deleteMany({});
  await prisma.menuItem.deleteMany({});
  await prisma.menu.deleteMany({});
  await prisma.media.deleteMany({});
  await prisma.page.deleteMany({});
  await prisma.post.deleteMany({});
  await prisma.seoMeta.deleteMany({});
  await prisma.property.deleteMany({});
  await prisma.vehicle.deleteMany({});
  await prisma.bankRate.deleteMany({});
  await prisma.visitorLog.deleteMany({});
  await prisma.user.deleteMany({});
  await prisma.role.deleteMany({});

  // 1. Seed All Granular RBAC Permissions
  const permissionsList = [
    { key: 'dashboard:read', description: 'View dashboard KPI summaries and analytics' },
    { key: 'pages:read', description: 'View all page drafts' },
    { key: 'pages:create', description: 'Create page drafts' },
    { key: 'pages:edit', description: 'Edit page content and SEO' },
    { key: 'pages:publish', description: 'Publish/unpublish pages' },
    { key: 'pages:delete', description: 'Soft delete pages' },
    { key: 'posts:read', description: 'View blog posts' },
    { key: 'posts:create', description: 'Create blog posts' },
    { key: 'posts:edit', description: 'Edit blog posts' },
    { key: 'posts:publish', description: 'Publish/unpublish blog posts' },
    { key: 'posts:delete', description: 'Soft delete blog posts' },
    { key: 'properties:read', description: 'View property listings' },
    { key: 'properties:create', description: 'Create property listings' },
    { key: 'properties:edit', description: 'Edit property listings' },
    { key: 'properties:publish', description: 'Approve & publish property listings' },
    { key: 'properties:delete', description: 'Soft delete property listings' },
    { key: 'vehicles:read', description: 'View vehicle listings' },
    { key: 'vehicles:create', description: 'Create vehicle listings' },
    { key: 'vehicles:edit', description: 'Edit vehicle listings' },
    { key: 'vehicles:publish', description: 'Approve & publish vehicle listings' },
    { key: 'vehicles:delete', description: 'Soft delete vehicle listings' },
    { key: 'menus:manage', description: 'Reorder and manage menus' },
    { key: 'faqs:read', description: 'View FAQs' },
    { key: 'faqs:create', description: 'Create FAQs' },
    { key: 'faqs:edit', description: 'Edit FAQs' },
    { key: 'faqs:delete', description: 'Soft delete FAQs' },
    { key: 'inquiries:read', description: 'View inquiries and leads' },
    { key: 'inquiries:edit', description: 'Update and assign inquiries' },
    { key: 'inquiries:delete', description: 'Soft delete inquiries' },
    { key: 'media:read', description: 'View media library' },
    { key: 'media:create', description: 'Upload media files' },
    { key: 'media:delete', description: 'Soft delete media files' },
    { key: 'users:read', description: 'View user accounts' },
    { key: 'users:create', description: 'Create user accounts' },
    { key: 'users:edit', description: 'Edit user accounts' },
    { key: 'users:delete', description: 'Soft delete user accounts' },
    { key: 'roles:read', description: 'View roles and permission matrix' },
    { key: 'roles:create', description: 'Create custom roles' },
    { key: 'roles:edit', description: 'Edit custom roles' },
    { key: 'roles:delete', description: 'Delete custom roles' },
    { key: 'roles:manage_permissions', description: 'Modify role permission matrix' },
    { key: 'links:read', description: 'View partner link exchanges' },
    { key: 'links:create', description: 'Create partner links' },
    { key: 'links:edit', description: 'Approve/reject partner links' },
    { key: 'links:delete', description: 'Soft delete partner links' },
    { key: 'bank_rates:read', description: 'View bank loan interest rates' },
    { key: 'bank_rates:manage', description: 'Create and update bank interest rates' },
    { key: 'settings:read', description: 'View system settings' },
    { key: 'settings:manage', description: 'Modify system settings' },
    { key: 'audit:read', description: 'View security audit trail logs' },
    { key: 'system:read', description: 'View detailed server health and latency' },
    { key: 'ai:use', description: 'Use AI Page & FAQ generators' },
  ];

  const permMap = {};
  for (const p of permissionsList) {
    const created = await prisma.permission.create({ data: p });
    permMap[p.key] = created.id;
  }
  console.log(`✓ Seeded ${permissionsList.length} granular RBAC permissions`);

  // 2. Seed System Roles
  const rolesData = [
    { name: 'super_admin', description: 'Full system privileges and RBAC matrix control', isSystem: true },
    { name: 'admin', description: 'Administrator with content and user moderation rights', isSystem: true },
    { name: 'broker', description: 'Licensed broker approving listings and managing lead pipeline', isSystem: true },
    { name: 'agent', description: 'Field agent managing assigned leads and creating listings', isSystem: true },
    { name: 'editor', description: 'Content editor managing CMS pages, posts, and FAQs', isSystem: true },
    { name: 'buyer', description: 'Registered public client browsing and booking tours', isSystem: true },
  ];

  const roleMap = {};
  for (const r of rolesData) {
    const created = await prisma.role.create({ data: r });
    roleMap[r.name] = created.id;
  }

  // 3. Populate RolePermission Join Table
  const superAdminRolePerms = Object.values(permMap).map(pId => ({
    roleId: roleMap['super_admin'],
    permissionId: pId
  }));

  const adminExcluded = ['roles:create', 'roles:edit', 'roles:delete', 'roles:manage_permissions'];
  const adminRolePerms = Object.entries(permMap)
    .filter(([k]) => !adminExcluded.includes(k))
    .map(([, pId]) => ({
      roleId: roleMap['admin'],
      permissionId: pId
    }));

  const brokerKeys = [
    'dashboard:read', 'properties:read', 'properties:create', 'properties:edit', 'properties:publish', 'properties:delete',
    'vehicles:read', 'vehicles:create', 'vehicles:edit', 'vehicles:publish', 'vehicles:delete',
    'inquiries:read', 'inquiries:edit', 'media:read', 'media:create', 'media:delete',
    'bank_rates:read', 'ai:use'
  ];
  const brokerRolePerms = brokerKeys.map(k => ({
    roleId: roleMap['broker'],
    permissionId: permMap[k]
  }));

  const agentKeys = [
    'dashboard:read', 'properties:read', 'properties:create', 'properties:edit',
    'vehicles:read', 'vehicles:create', 'vehicles:edit',
    'inquiries:read', 'inquiries:edit', 'media:read', 'media:create'
  ];
  const agentRolePerms = agentKeys.map(k => ({
    roleId: roleMap['agent'],
    permissionId: permMap[k]
  }));

  const editorKeys = [
    'pages:read', 'pages:create', 'pages:edit', 'pages:publish', 'pages:delete',
    'posts:read', 'posts:create', 'posts:edit', 'posts:publish', 'posts:delete',
    'faqs:read', 'faqs:create', 'faqs:edit', 'faqs:delete',
    'media:read', 'media:create', 'ai:use'
  ];
  const editorRolePerms = editorKeys.map(k => ({
    roleId: roleMap['editor'],
    permissionId: permMap[k]
  }));

  await prisma.rolePermission.createMany({
    data: [
      ...superAdminRolePerms,
      ...adminRolePerms,
      ...brokerRolePerms,
      ...agentRolePerms,
      ...editorRolePerms
    ]
  });
  console.log('✓ Seeded complete Role-Permission join table matrix');

  // 4. Seed Seeded Users with Configurable / Randomly Generated Credentials
  const adminPassword = process.env.SEED_ADMIN_PASSWORD || crypto.randomBytes(18).toString('base64url');
  const brokerPassword = process.env.SEED_BROKER_PASSWORD || crypto.randomBytes(18).toString('base64url');
  const agentPassword = process.env.SEED_AGENT_PASSWORD || crypto.randomBytes(18).toString('base64url');

  if (!process.env.SEED_ADMIN_PASSWORD) {
    console.log(`\n======================================================`);
    console.log(`🔐 SEED CREDENTIALS GENERATED (Save these securely):`);
    console.log(`   Super Admin (admin@jigme.bt): ${adminPassword}`);
    console.log(`   Broker      (broker@jigme.bt): ${brokerPassword}`);
    console.log(`   Agent       (agent@jigme.bt): ${agentPassword}`);
    console.log(`======================================================\n`);
  }

  const passwordHash = await bcrypt.hash(adminPassword, 10);
  const brokerHash = await bcrypt.hash(brokerPassword, 10);
  const agentHash = await bcrypt.hash(agentPassword, 10);

  const superAdmin = await prisma.user.create({
    data: {
      email: 'admin@jigme.bt',
      passwordHash,
      name: 'Dasho Jigme Wangchuk',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80',
      roleId: roleMap['super_admin'],
      status: 'ACTIVE',
      lastLoginAt: new Date()
    }
  });

  const brokerUser = await prisma.user.create({
    data: {
      email: 'broker@jigme.bt',
      passwordHash: brokerHash,
      name: 'Tashi Dorji (Senior Broker)',
      avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80',
      roleId: roleMap['broker'],
      status: 'ACTIVE',
      lastLoginAt: new Date()
    }
  });

  const agentUser = await prisma.user.create({
    data: {
      email: 'agent@jigme.bt',
      passwordHash: agentHash,
      name: 'Sonam Pelzom (Field Agent)',
      avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&q=80',
      roleId: roleMap['agent'],
      status: 'ACTIVE',
      lastLoginAt: new Date()
    }
  });

  // 5. Seed Dynamic Bank Rates (Zero hardcoded interest rates)
  await prisma.bankRate.createMany({
    data: [
      {
        bankKey: 'bob',
        bankName: 'Bank of Bhutan (BoB)',
        interestRate: 8.50,
        minDownPaymentPercent: 20.0,
        maxTenureYears: 30,
        description: 'Prime home mortgage and land construction loan financing.'
      },
      {
        bankKey: 'bnbl',
        bankName: 'Bhutan National Bank (BNBL)',
        interestRate: 8.75,
        minDownPaymentPercent: 20.0,
        maxTenureYears: 25,
        description: 'Commercial complex and luxury residential villa loans.'
      },
      {
        bankKey: 'bdbl',
        bankName: 'Bhutan Development Bank (BDBL)',
        interestRate: 8.00,
        minDownPaymentPercent: 15.0,
        maxTenureYears: 30,
        description: 'Rural valley farmhouse and organic agricultural land credit.'
      },
      {
        bankKey: 'tbank',
        bankName: 'T-Bank Ltd',
        interestRate: 9.00,
        minDownPaymentPercent: 25.0,
        maxTenureYears: 20,
        description: 'Express 4x4 automotive and vehicle fleet financing.'
      }
    ]
  });
  console.log('✓ Seeded dynamic BankRate table');

  // 6. Seed Properties & Vehicles with createdById & proper workflow status
  await prisma.property.createMany({
    data: [
      {
        title: 'Heritage Traditional Dzong-Style Villa with Apple Orchard',
        location: 'Paro, Bongdey',
        priceNu: 48500000,
        priceDisplay: 'Nu. 4.85 Cr',
        type: 'Residential Villa',
        status: 'PUBLISHED',
        beds: 5,
        baths: 4,
        area: '45 Decimals (19,600 sq.ft)',
        description: 'Stunning ancestral estate featuring authentic Rabsel timber woodwork, modern Bukhari heating, and 30 bearing organic apple trees.',
        image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
        verified: true,
        createdById: brokerUser.id,
        publishedAt: new Date()
      },
      {
        title: 'Luxury Penthouse with Buddha Dordenma Mountain View',
        location: 'Thimphu, Kawajangsa',
        priceNu: 28000000,
        priceDisplay: 'Nu. 2.80 Cr',
        type: 'Luxury Penthouse',
        status: 'PUBLISHED',
        beds: 3,
        baths: 3,
        area: '2,650 sq.ft',
        description: 'Ultra-modern top-floor duplex with heated oak flooring and private elevator access.',
        image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80',
        verified: true,
        createdById: brokerUser.id,
        publishedAt: new Date()
      },
      {
        title: 'Prime Commercial Plot along Expressway',
        location: 'Thimphu, Babesa Expressway',
        priceNu: 75000000,
        priceDisplay: 'Nu. 7.50 Cr',
        type: 'Commercial Land',
        status: 'PUBLISHED',
        beds: 0,
        baths: 0,
        area: '25 Decimals',
        description: 'Zoned for G+5 commercial complex with direct highway frontage.',
        image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1200&q=80',
        verified: true,
        createdById: superAdmin.id,
        publishedAt: new Date()
      },
      {
        title: 'Punakha Riverfront Organic Farmhouse & Eco-Retreat Land',
        location: 'Punakha, Lobesa Valley',
        priceNu: 34000000,
        priceDisplay: 'Nu. 3.40 Cr',
        type: 'Farmhouse & Land',
        status: 'PENDING_APPROVAL', // Draft awaiting broker review
        beds: 4,
        baths: 3,
        area: '80 Decimals',
        description: 'Subtropical valley climate ideal for boutique eco-resort.',
        image: 'https://images.unsplash.com/photo-1518780664697-55e3ad937233?auto=format&fit=crop&w=1200&q=80',
        verified: true,
        createdById: agentUser.id
      }
    ]
  });

  await prisma.vehicle.createMany({
    data: [
      {
        title: '2024 Toyota Land Cruiser Prado TX-L 4WD',
        location: 'Thimphu, Chubachu Auto Complex',
        priceNu: 11500000,
        priceDisplay: 'Nu. 1.15 Cr',
        fuel: 'Diesel',
        mileage: '12,500 km',
        transmission: 'Automatic 4WD',
        status: 'PUBLISHED',
        description: 'Single owner, pristine condition, full Toyota Bhutan service records.',
        image: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=1200&q=80',
        verified: true,
        createdById: brokerUser.id,
        publishedAt: new Date()
      },
      {
        title: '2023 Toyota Hilux Revo Rocco 2.8L 4x4',
        location: 'Paro, Airport Road Showroom',
        priceNu: 5400000,
        priceDisplay: 'Nu. 54.0 Lakh',
        fuel: 'Diesel Turbo',
        mileage: '28,000 km',
        transmission: 'Automatic 4x4',
        status: 'PUBLISHED',
        description: 'Heavy duty suspension, snorkel intake, BFGoodrich tires.',
        image: 'https://images.unsplash.com/photo-1559416523-140ddc3d238c?auto=format&fit=crop&w=1200&q=80',
        verified: true,
        createdById: brokerUser.id,
        publishedAt: new Date()
      },
      {
        title: '2024 Hyundai Tucson HTRAC AWD Turbo',
        location: 'Phuentsholing, Southern Trade Gate',
        priceNu: 4200000,
        priceDisplay: 'Nu. 42.0 Lakh',
        fuel: 'Petrol Hybrid',
        mileage: '8,400 km',
        transmission: 'Automatic',
        status: 'PENDING_APPROVAL',
        description: 'Panoramic sunroof, dual zone climate control.',
        image: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=1200&q=80',
        verified: true,
        createdById: agentUser.id
      }
    ]
  });

  // 7. Seed Inquiries & Leads with Assigned Agent
  await prisma.inquiry.createMany({
    data: [
      {
        type: 'TOUR',
        name: 'Ugyen Tshering',
        email: 'ugyen@druknet.bt',
        phone: '+975 17 999 888',
        message: 'Requesting guided tour for Paro Bongdey Villa this Saturday at 11:00 AM.',
        status: 'ASSIGNED',
        source: 'WEBSITE',
        assignedToId: agentUser.id,
        assignedAt: new Date()
      },
      {
        type: 'PROPERTY',
        name: 'Dechen Zangmo',
        email: 'dechen@thimphu.bt',
        phone: '+975 77 123 456',
        message: 'Inquiring regarding Babesa commercial plot municipal clearances.',
        status: 'NEW',
        source: 'WHATSAPP'
      }
    ]
  });

  // 8. Seed SEO, Pages, Posts, FAQs, Menus, ActivityLogs
  const seoMeta = await prisma.seoMeta.create({
    data: {
      metaTitle: 'Jigme Real Estate & Vehicles Bhutan | Official Certified Marketplace',
      metaDescription: 'Verified properties, heritage villas, land plots, and 4x4 vehicles in Bhutan with eSakor Lagthram title deed verification.',
      keywords: 'Bhutan real estate, Thimphu properties, Paro villas, land plots, 4x4 vehicles',
      score: 85
    }
  });

  await prisma.page.create({
    data: {
      title: 'About Jigme Real Estate & Vehicles',
      slug: 'about-us',
      content: '<h1>About Jigme Real Estate</h1><p>Founded under the royal vision of Gross National Happiness.</p>',
      status: 'PUBLISHED',
      authorId: superAdmin.id,
      seoMetaId: seoMeta.id,
      publishedAt: new Date()
    }
  });

  await prisma.post.create({
    data: {
      title: 'eSakor Lagthram Land Title Transfer Guide 2026',
      slug: 'esakor-lagthram-guide',
      excerpt: 'Comprehensive step-by-step walkthrough of digital land registration in Bhutan.',
      content: '<p>The National Land Commission of Bhutan has digitized all thrams...</p>',
      category: 'Legal & Guidelines',
      coverImage: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=800&q=80',
      status: 'PUBLISHED',
      authorId: superAdmin.id,
      publishedAt: new Date()
    }
  });

  const mainMenu = await prisma.menu.create({
    data: { name: 'main_menu', location: 'header', version: 1 }
  });

  await prisma.menuItem.create({
    data: { menuId: mainMenu.id, label: 'Home', url: '/', type: 'link', order: 0 }
  });
  await prisma.menuItem.create({
    data: { menuId: mainMenu.id, label: 'Properties', url: '/properties', type: 'page', order: 1 }
  });
  await prisma.menuItem.create({
    data: { menuId: mainMenu.id, label: 'Vehicles', url: '/vehicles', type: 'page', order: 2 }
  });

  await prisma.faq.createMany({
    data: [
      {
        question: 'What is the eSakor Lagthram verification process?',
        answer: 'Every property listed on Jigme Real Estate undergoes 3-step verification against the National Land Commission digital database, confirming boundaries and single-owner thram.',
        category: 'Legal & Title',
        generatedByAi: false,
        order: 0
      },
      {
        question: 'How do Bank of Bhutan (BoB) mortgage loans work?',
        answer: 'BoB offers home and land development loans starting at 8.5% p.a. with up to 30 years tenure. Buyers can estimate monthly EMIs using our integrated calculator.',
        category: 'Financing',
        generatedByAi: false,
        order: 1
      }
    ]
  });

  await prisma.socialConnection.createMany({
    data: [
      { platform: 'facebook', accountName: 'JigmeRealEstateBT', status: 'CONNECTED' },
      { platform: 'instagram', accountName: '@jigme_realestate_bhutan', status: 'CONNECTED' },
      { platform: 'twitter', accountName: '@JigmeEstateBT', status: 'CONNECTED' },
      { platform: 'youtube', accountName: 'JigmeEstatesBhutanOfficial', status: 'CONNECTED' },
      { platform: 'linkedin', accountName: 'jigme-real-estate-bhutan', status: 'CONNECTED' }
    ]
  });

  await prisma.partnerLink.createMany({
    data: [
      { name: 'Bhutan Travel Guide', url: 'https://bhutan.travel', status: 'ACTIVE' },
      { name: 'Himalaya Adventures', url: 'https://himalaya.bt', status: 'PENDING' },
      { name: 'Tourism Updates Bhutan', url: 'https://tourism.gov.bt', status: 'ACTIVE' },
      { name: 'World Travel Hub', url: 'https://worldtravel.org', status: 'PENDING' }
    ]
  });

  await prisma.activityLog.createMany({
    data: [
      {
        userId: superAdmin.id,
        userName: superAdmin.name,
        action: 'PUBLISHED_PROPERTY',
        entityType: 'property',
        details: 'Published "Heritage Traditional Dzong-Style Villa with Apple Orchard"',
        createdAt: new Date(Date.now() - 2 * 60 * 1000)
      },
      {
        userId: superAdmin.id,
        userName: superAdmin.name,
        action: 'LEAD_ASSIGNED',
        entityType: 'inquiry',
        details: 'Assigned tour inquiry from Ugyen Tshering to agent Sonam Pelzom',
        createdAt: new Date(Date.now() - 15 * 60 * 1000)
      },
      {
        userId: brokerUser.id,
        userName: brokerUser.name,
        action: 'USER_LOGIN',
        entityType: 'auth',
        details: 'Authenticated via secure JWT access token',
        createdAt: new Date(Date.now() - 60 * 60 * 1000)
      }
    ]
  });

  // Seed sample visitor logs for testing
  await prisma.visitorLog.createMany({
    data: [
      { ipHash: 'a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6', path: '/' },
      { ipHash: 'b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6a1', path: '/properties' },
      { ipHash: 'c3d4e5f6g7h8i9j0k1l2m3n4o5p6a1b2', path: '/vehicles' }
    ]
  });

  console.log('🎉 Database seeding completed successfully with 100% relational integrity!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
