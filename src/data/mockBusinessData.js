/**
 * @fileoverview Base de datos comercial hiper-realista para Cumaná, Estado Sucre, Venezuela.
 * Incluye categorización precisa, soporte para métodos de pago venezolanos (Cashea, Pago Móvil, Binance, etc.),
 * geolocalización en Cumaná y estructura enriquecida para negocios Estándar y Destacados (VIP).
 */

export const CATEGORIES = [
  { id: 'all',           label: 'Todas',             icon: 'Layers',      emoji: '🗺️' },
  { id: 'farmacias_24h', label: 'Farmacias 24h',     icon: 'Pill',        emoji: '💊' },
  { id: 'salud',         label: 'Clínicas y Salud',  icon: 'Stethoscope', emoji: '🏥' },
  { id: 'restaurantes',  label: 'Restaurantes',      icon: 'Utensils',    emoji: '🍔' },
  { id: 'reposteria',    label: 'Reposterías',       icon: 'Cake',        emoji: '🍰' },
  { id: 'talleres',      label: 'Talleres',          icon: 'Wrench',      emoji: '🔧' },
  { id: 'librerias',     label: 'Librerías',         icon: 'BookOpen',    emoji: '📚' },
  { id: 'emprendedores', label: 'Emprendedores',     icon: 'Lightbulb',   emoji: '💡' },
  { id: 'tiendas',       label: 'Tiendas y Super',   icon: 'Store',       emoji: '🛒' },
];

export const CUMANA_ZONES = [
  'Todas las zonas',
  'Av. Bermúdez',
  'Av. Universidad',
  'Playa San Luis',
  'CC Hipergalerías',
  'Sector Centro',
  'Cantarrana',
  'Los Chaimas',
  'Av. Perimetral',
  'Centro Histórico',
  'Av. Andrés Eloy Blanco',
];

export const PAYMENT_METHODS_CONFIG = {
  cashea: {
    id: 'cashea',
    name: 'Cashea',
    badgeText: 'Cashea Aceptado',
    shortLabel: 'Cashea',
    bgClass: 'bg-[#FFE600] text-slate-950 border-amber-300 font-bold',
    dotClass: 'bg-slate-950',
    isHighlight: true,
  },
  pago_movil: {
    id: 'pago_movil',
    name: 'Pago Móvil',
    badgeText: 'Pago Móvil',
    shortLabel: 'Pago Móvil',
    bgClass: 'bg-blue-50 text-blue-700 border-blue-200/80',
    dotClass: 'bg-blue-600',
    isHighlight: false,
  },
  binance: {
    id: 'binance',
    name: 'Binance Pay / USDT',
    badgeText: 'Binance / USDT',
    shortLabel: 'Binance',
    bgClass: 'bg-amber-50 text-amber-800 border-amber-200/80',
    dotClass: 'bg-amber-500',
    isHighlight: false,
  },
  usd_cash: {
    id: 'usd_cash',
    name: 'Divisas USD / Zelle',
    badgeText: 'USD / Zelle',
    shortLabel: 'USD / Zelle',
    bgClass: 'bg-emerald-50 text-emerald-700 border-emerald-200/80',
    dotClass: 'bg-emerald-600',
    isHighlight: false,
  },
  punto_de_venta: {
    id: 'punto_de_venta',
    name: 'Punto de Venta / Biopago',
    badgeText: 'Punto de Venta',
    shortLabel: 'Punto / Débito',
    bgClass: 'bg-slate-50 text-slate-700 border-slate-200/80',
    dotClass: 'bg-slate-600',
    isHighlight: false,
  },
};

export const businesses = [{id:`biz-econoquesos`,name:`Econoquesos Cumaná`,slug:`econoquesos-cumana`,category:`tiendas`,categoryLabel:`Supermercados & Charcuterías`,isFeatured:!0,isSpotlight:!0,isMultiBranch:!0,branchCount:3,spotlightTagline:`Calidad, frescura y los mejores precios en charcutería, quesos y víveres para toda Cumaná`,spotlightPromoTitle:`Combo Imperdible Charcutero`,spotlightPromoBadge:`CADENA 3 SEDES`,spotlightPromoDesc:`Jamón ahumado superior, queso semiduro llanero, mortadela gourmet y mantequilla fresca en cualquiera de nuestras 3 sedes de Cumaná.`,isVerified:!0,isOpen24h:!1,deliveryAvailable:!0,schedule:{"Lunes a Sábado":`08:00 AM - 09:00 PM`,Domingo:`08:00 AM - 02:00 PM`},zone:`Sector Centro`,address:`Sedes en Av. Blanco Fombona, Av. Cancamure y Av. Santa Rosa, Cumaná`,googleMapsUrl:`https://maps.google.com/?q=Econoquesos+Cumana+Sucre`,whatsapp:`584248881066`,phone:`+58 424-8881066`,instagram:`@econoplaza`,tiktok:`@econoquesos`,twitter:`@econoquesos`,facebook:`econoquesoscumana`,youtube:`@econoquesos`,paymentMethods:[`cashea`,`pago_movil`,`punto_de_venta`,`usd_cash`,`binance`],activePromotion:`Combo Charcutero Imperdible con Cashea (Línea Cotidiana y Cuotas)`,casheaEnabled:!0,casheaModalities:[`cotidiana`,`clasica`,`mas_cuotas`],casheaMaxCuotas:12,casheaCardTitle:`Cashea en las 3 Sedes`,casheaCardDesc:`Disponible en nuestras 3 sucursales de Cumaná bajo la modalidad Línea Cotidiana: inicial en caja y 2 cuotas quincenales sin interés a tasa BCV.`,casheaCardBadge:`✓ Aceptado en las 3 sedes`,casheaHeroBadge:`Cashea Activo (Línea Cotidiana)`,bannerUrl:`/images/econoqueso-banner.jpg`,logoUrl:`🧀`,description:`La gran cadena de charcutería, quesos al mayor y detal, víveres y supermercado de Cumaná. Especialistas en queso blanco semiduro llanero, queso guayanés, queso paisa, jamones, embutidos y productos de primera necesidad. Contamos con 3 sucursales estratégicas en la ciudad: Sede Central (Blanco Fombona), Econoquesos Plaza (Cancamure) y Sede Express (Santa Rosa). Aceptamos Cashea en todas nuestras tiendas.`,photos:[`/images/econoqueso-banner.jpg`,`/images/econoqueso-store.jpg`,`/images/econoqueso-flyer.jpg`],rating:4.9,reviewCount:640,tags:[`quesos`,`charcuteria`,`econoquesos`,`cashea`,`blanco fombona`,`cancamure`,`santa rosa`,`viveres`,`mayor y detal`,`supermercado`,`delivery`],branches:[{id:`branch-central`,name:`Sede Central — Blanco Fombona`,shortName:`Sede Central`,shortZone:`Centro / Cascajal`,tag:`SEDE PRINCIPAL`,address:`Av. Blanco Fombona, cruce con Calle México (Sector Centro / Cascajal), Cumaná`,reference:`A 100 metros de la Av. Arismendi, pleno centro comercial`,zone:`Sector Centro`,phone:`+58 424-8881066`,whatsapp:`584248881066`,whatsappMessage:`¡Hola Econoquesos! Me comunico con la Sede Central (Blanco Fombona) desde CumanáConecta para consultar disponibilidad y precios.`,schedule:`Lunes a Sábado: 8:00 AM - 8:30 PM | Domingo: 8:00 AM - 2:00 PM`,openStatusText:`Abierto hoy hasta las 8:30 PM`,googleMapsUrl:`https://maps.google.com/?q=Av+Blanco+Fombona+Cumana+Sucre`,photo:`/images/econoqueso-store.jpg`,features:[`Charcutería al Mayor y Detal`,`Ventas por Pieza y Bulto`,`Cajas de Pago Rápido`,`Cashea Activo en 3 Cuotas`,`Atención Especial a Restaurantes`]},{id:`branch-cancamure`,name:`Econoquesos Plaza — Av. Cancamure`,shortName:`Econoquesos Plaza`,shortZone:`Cancamure / El Brasil`,tag:`HIPERMERCADO & EQ FARMA`,address:`Av. Cancamure, frente al complejo comercial Cancamure, Cumaná`,reference:`Al lado de Farmacia EQ Farma, sector El Brasil / Cancamure`,zone:`Cantarrana`,phone:`+58 424-8881066`,whatsapp:`584248881066`,whatsappMessage:`¡Hola Econoquesos! Me comunico con Econoquesos Plaza (Av. Cancamure) desde CumanáConecta para hacer una compra con delivery.`,schedule:`Lunes a Sábado: 8:00 AM - 9:00 PM | Domingo: 8:00 AM - 2:00 PM`,openStatusText:`Abierto hoy hasta las 9:00 PM`,googleMapsUrl:`https://maps.google.com/?q=Av+Cancamure+Cumana+Sucre`,photo:`/images/econoqueso-banner.jpg`,features:[`Supermercado y Víveres Completos`,`Farmacia EQ Farma Integrada`,`Amplio Estacionamiento Privado`,`Neveras de Lácteos Gigantes`,`Cashea y Todos los Métodos de Pago`]},{id:`branch-santarosa`,name:`Sede Express — Santa Rosa`,shortName:`Sede Express`,shortZone:`Santa Rosa / Urdaneta`,tag:`FORMATO EXPRESS`,address:`Av. Santa Rosa, esquina Calle Urdaneta, Cumaná`,reference:`Frente al eje comercial de Santa Rosa`,zone:`Sector Centro`,phone:`+58 424-8881066`,whatsapp:`584248881066`,whatsappMessage:`¡Hola Econoquesos! Me comunico con la Sede Express (Santa Rosa) desde CumanáConecta para consultar pedidos rápidos.`,schedule:`Lunes a Sábado: 8:00 AM - 8:00 PM | Domingo: 8:00 AM - 1:30 PM`,openStatusText:`Abierto hoy hasta las 8:00 PM`,googleMapsUrl:`https://maps.google.com/?q=Av+Santa+Rosa+Cumana+Sucre`,photo:`/images/econoqueso-flyer.jpg`,features:[`Compras Rápidas de Paso`,`Charcutería Fresca Diaria`,`Punto de Venta & Pago Móvil`,`Cashea Inmediato`,`Despacho al Instante`]}],promotionalFlyers:[{id:`flyer-combo-delicias`,title:`¡Combo Delicias para tu Mesa en Cumaná!`,subtitle:`Válido en las 3 Sedes: Blanco Fombona, Cancamure y Santa Rosa`,badge:`OFERTA DE LA SEMANA`,image:`/images/econoqueso-flyer.jpg`,description:`Jamón ahumado superior, queso blanco semiduro venezolano, mortadela gourmet, mantequilla fresca y pan artesanal. ¡Págalo con Cashea (Línea Cotidiana o en cuotas sin interés)!`,price:`Combo Especial $12.99`,buttonText:`Pedir Combo por WhatsApp`,ctaMessage:`Hola Econoquesos, quiero pedir el Combo Especial de la semana que vi en CumanáConecta.`},{id:`flyer-mayoristas`,title:`🧀 Ventas al Mayor para Pizzerías, Panaderías y Restaurantes`,subtitle:`Precios especiales por pieza completa y bultos cerrados`,badge:`PLAN MAYORISTA`,image:`/images/econoqueso-banner.jpg`,description:`Garantizamos abastecimiento continuo con los mejores quesos llaneros, quesos amarillos, mozzarella y embutidos de primera para negocios en toda Cumaná.`,price:`Precios Especiales de Distribuidor`,buttonText:`Solicitar Lista Mayorista`,ctaMessage:`Hola Econoquesos, tengo un negocio en Cumaná y deseo solicitar su lista de precios de queso y charcutería al mayor.`}],products:[{id:`p1`,name:`Queso Blanco Llanero Semiduro (1 Kg)`,price:5.8,unit:`kg`,tag:`Más Vendido`,photo:`/images/econoqueso-banner.jpg`},{id:`p2`,name:`Queso Amarillo Tipo Paisa (1 Kg)`,price:8.9,unit:`kg`,tag:`Favorito`,photo:`/images/econoqueso-banner.jpg`},{id:`p3`,name:`Queso Guayanés Artesanal Fresco (1 Kg)`,price:6.9,unit:`kg`,tag:`Artesanal`,photo:`/images/econoqueso-banner.jpg`},{id:`p4`,name:`Jamón de Pierna Ahumado Superior (1 Kg)`,price:9.8,unit:`kg`,tag:`Calidad Premium`,photo:`/images/econoqueso-flyer.jpg`},{id:`p5`,name:`Combo Charcutero Semanal Econoqueso`,price:14.99,unit:`combo`,tag:`Súper Ahorro`,photo:`/images/econoqueso-flyer.jpg`},{id:`p6`,name:`Mortadela Especial Tapara (1 Kg)`,price:4.5,unit:`kg`,tag:`Económico`,photo:`/images/econoqueso-flyer.jpg`},{id:`p7`,name:`Mantequilla Criolla Fresca (500g)`,price:3.2,unit:`pza`,tag:`Frescura`,photo:`/images/econoqueso-store.jpg`},{id:`p8`,name:`Salchichas Tipo Viena Plumrose (Paquete)`,price:3.9,unit:`paq`,tag:`Tradicional`,photo:`/images/econoqueso-store.jpg`}]},{id:`biz-000`,name:`Marisquería & Bohío La Casona de San Luis`,slug:`marisqueria-la-casona-de-san-luis`,category:`restaurantes`,categoryLabel:`Gastronomía & Mariscos`,isFeatured:!0,isSpotlight:!0,spotlightTagline:`El auténtico sabor del Golfo de Cariaco frente al mar`,spotlightPromoTitle:`Combo Playero Pargo Rojo`,spotlightPromoBadge:`RECOMENDADO`,spotlightPromoDesc:`Pargo frito de 700g con tostones playeros, queso paisa y ensalada tropical + 2 bebidas por $18.`,isVerified:!0,isOpen24h:!1,deliveryAvailable:!0,schedule:{"Lunes a Domingo":`11:00 AM - 10:00 PM`},zone:`Playa San Luis`,address:`Av. Universidad, Sector Los Bordones, Playa San Luis, Cumaná`,googleMapsUrl:`https://www.google.com/maps/search/Playa+San+Luis+Cumana+Sucre/@10.4350,-64.2050,16z`,whatsapp:`584121234567`,phone:`+58 293-4328899`,instagram:`@lacasonadesanluis`,tiktok:`@lacasonadesanluis`,youtube:`https://youtube.com/@lacasonadesanluis`,videoTourUrl:`https://www.youtube.com/watch?v=dQw4w9WgXcQ`,videoTourTitle:`Ruta costera por Av. Universidad hacia Playa San Luis y entrada al bohío`,paymentMethods:[`cashea`,`pago_movil`,`usd_cash`,`binance`,`punto_de_venta`],activePromotion:`Combo Playero Pargo Rojo 700g con tostones y bebidas por $18`,bannerUrl:`https://images.unsplash.com/photo-1544025162-d76694265947?w=1000&q=80`,logoUrl:`🐟`,description:`Tradicional restaurante playero ubicado frente al azul del Mar Caribe en San Luis. Especialistas en pargo rojo frito al ajillo, rueda de carite, cazuela de mariscos y fosforera cumanesa con tostones y ensalada rayada. Ambiente familiar con brisa marina.`,photos:[`https://images.unsplash.com/photo-1544025162-d76694265947?w=900&q=80`,`https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=500&q=80`,`https://images.unsplash.com/photo-1559339352-11d035aa65de?w=500&q=80`,`https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=500&q=80`],rating:4.9,reviewCount:512,tags:[`pescado frito`,`pargo rojo`,`playa san luis`,`mariscos`,`delivery`,`fosforera`]},{id:`biz-001`,name:`Farmacia La Marina 24H`,slug:`farmacia-la-marina-24h`,category:`farmacias_24h`,categoryLabel:`Farmacias 24h & Salud`,isFeatured:!0,isSpotlight:!0,spotlightTagline:`Tu salud y bienestar protegidos las 24 horas del día`,spotlightPromoTitle:`Jornada Preventiva 24 Horas`,spotlightPromoBadge:`DESTACADO`,spotlightPromoDesc:`Toma de tensión gratuita y 20% de descuento en vitaminas e insumos de primeros auxilios con Cashea.`,isVerified:!0,isOpen24h:!0,deliveryAvailable:!0,schedule:{"Lunes a Domingo":`24 Horas Ininterrumpidas`},zone:`Av. Bermúdez`,address:`Av. Bermúdez, Edificio Mar, Planta Baja (frente a la Plaza del Estudiante), Cumaná, Edo. Sucre`,googleMapsUrl:`https://www.google.com/maps/search/Farmacia+Av.+Bermudez+Cumana+Sucre+Venezuela/@10.4568,-64.1730,16z`,whatsapp:`584147723100`,phone:`+58 293-4312200`,instagram:`@farmacialamarina24`,tiktok:`@farmacialamarina24`,youtube:`https://youtube.com/@farmacialamarina24`,videoTourUrl:`https://www.youtube.com/watch?v=dQw4w9WgXcQ`,videoTourTitle:`Ruta rápida desde la Plaza del Estudiante hasta la entrada 24H`,paymentMethods:[`cashea`,`pago_movil`,`binance`,`usd_cash`,`punto_de_venta`],activePromotion:`20% OFF en protectores solares y vitaminas con Cashea`,bannerUrl:`https://images.unsplash.com/photo-1576671081837-49000212a370?w=1000&q=80`,logoUrl:`💊`,description:`Farmacia de guardia permanente con amplio inventario en medicamentos de alta especialidad, insumos médicos quirúrgicos, fórmulas infantiles y servicio de delivery motorizado en toda Cumaná.`,photos:[`https://images.unsplash.com/photo-1576671081837-49000212a370?w=900&q=80`,`https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=500&q=80`,`https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=500&q=80`,`https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=500&q=80`],rating:4.9,reviewCount:384,tags:[`medicamentos`,`guardia 24h`,`delivery`,`inyectología`,`misceláneos`]},{id:`biz-002`,name:`Marisquería El Golfo de Cariaco`,slug:`marisqueria-el-golfo-de-cariaco`,category:`restaurantes`,categoryLabel:`Restaurantes & Gastronomía`,isFeatured:!0,isVerified:!0,isOpen24h:!1,schedule:{"Lunes a Jueves":`11:00 AM - 10:00 PM`,"Viernes a Domingo":`10:30 AM - 11:30 PM`},zone:`Av. Perimetral`,address:`Av. Perimetral, Sector Paseo Miranda, frente al Golfo, Cumaná, Edo. Sucre`,googleMapsUrl:`https://www.google.com/maps/search/Restaurante+mariscos+Av.+Perimetral+Cumana+Sucre/@10.4618,-64.1789,16z`,whatsapp:`584121456789`,phone:`+58 293-4325544`,instagram:`@elgolfodecariaco`,tiktok:`@elgolfodecariaco`,youtube:`https://youtube.com/@elgolfodecariaco`,videoTourUrl:`https://www.youtube.com/watch?v=dQw4w9WgXcQ`,videoTourTitle:`Llegada frente al mar en Paseo Miranda y área de estacionamiento`,paymentMethods:[`cashea`,`pago_movil`,`usd_cash`,`binance`,`punto_de_venta`],activePromotion:`Combo Langosta + Tostones playeros con 15% de descuento fines de semana`,bannerUrl:`https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=1000&q=80`,logoUrl:`🦐`,description:`La auténtica tradición marina de Cumaná. Pescado frito fresco del día, langostas vivas, cazuela de mariscos, sopa de corocoro y ceviches artesanales con vista inigualable al mar.`,photos:[`https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=900&q=80`,`https://images.unsplash.com/photo-1559339352-11d035aa65de?w=500&q=80`,`https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=500&q=80`,`https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=500&q=80`],rating:4.8,reviewCount:412,tags:[`mariscos`,`pescado frito`,`ceviche`,`familiar`,`vista al mar`]},{id:`biz-003`,name:`Centro Clínico Sucre & Especialistas`,slug:`centro-clinico-sucre`,category:`salud`,categoryLabel:`Clínicas & Centros Médicos`,isFeatured:!0,isSpotlight:!0,spotlightTagline:`Excelencia médica y calidez humana en el corazón de Sucre`,spotlightPromoTitle:`Chequeo Integral Cardiovascular`,spotlightPromoBadge:`DESTACADO`,spotlightPromoDesc:`Consulta con especialista + Perfil lipídico y electrocardiograma con resultados inmediatos por solo $25.`,isVerified:!0,isOpen24h:!0,deliveryAvailable:!1,schedule:{"Emergencias Médicas":`24 Horas (Lunes a Domingo)`,"Consultas Externas":`Lunes a Viernes 7:00 AM - 7:00 PM`,Laboratorio:`Lunes a Sábado 6:30 AM - 4:00 PM`},zone:`Los Chaimas`,address:`Urb. Los Chaimas, Calle 3 con Av. Principal, Cumaná, Edo. Sucre`,googleMapsUrl:`https://www.google.com/maps/search/Centro+Clinico+Los+Chaimas+Cumana+Sucre/@10.4580,-64.1820,16z`,whatsapp:`584168834590`,phone:`+58 293-4327788`,instagram:`@ccsucremed`,tiktok:`@clinicasucre`,youtube:`https://youtube.com/@clinicasucrecumana`,videoTourUrl:`https://www.youtube.com/watch?v=dQw4w9WgXcQ`,videoTourTitle:`Entrada de emergencias 24h y área de estacionamiento en Los Chaimas`,paymentMethods:[`pago_movil`,`usd_cash`,`binance`,`punto_de_venta`],activePromotion:`Chequeo Preventivo Integral + Perfil 20 con resultados en 2 horas`,bannerUrl:`https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=1000&q=80`,logoUrl:`🏥`,description:`Centro hospitalario de vanguardia en Cumaná. Servicio de emergencia médica permanente, quirófanos modernos, imagenología digital, laboratorio clínico automatizado y más de 25 especialidades médicas.`,photos:[`https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=900&q=80`,`https://images.unsplash.com/photo-1586773860418-d37222d8fce3?w=500&q=80`,`https://images.unsplash.com/photo-1516549655169-df83a0774514?w=500&q=80`],rating:4.7,reviewCount:230,tags:[`clínica`,`emergencias`,`laboratorio`,`ecografías`,`pediatría`,`cardiología`]},{id:`biz-004`,name:`Dulces & Tortas Doña Inés`,slug:`dulces-tortas-dona-ines`,category:`reposteria`,categoryLabel:`Repostería & Dulcería Criolla`,isFeatured:!0,isVerified:!0,isOpen24h:!1,schedule:{"Lunes a Sábado":`8:30 AM - 7:00 PM`,Domingo:`9:00 AM - 2:00 PM`},zone:`Av. Universidad`,address:`Av. Universidad, C.C. Colonial Plaza, Local 08, Cumaná, Edo. Sucre`,googleMapsUrl:`https://www.google.com/maps/search/Pasteleria+Reposteria+Av.+Universidad+Cumana+Sucre/@10.4485,-64.1680,16z`,whatsapp:`584148991122`,phone:`+58 414-8991122`,instagram:`@donaines_reposteria`,tiktok:`@donainescake`,youtube:``,videoTourUrl:`https://www.youtube.com/watch?v=dQw4w9WgXcQ`,videoTourTitle:`Cómo llegar al Local 08 en C.C. Colonial Plaza (Av. Universidad)`,paymentMethods:[`cashea`,`pago_movil`,`usd_cash`,`punto_de_venta`],activePromotion:`Combo Cumpleañero: Torta 1Kg + 24 Pasapalos con 10% OFF en Cashea`,bannerUrl:`https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=1000&q=80`,logoUrl:`🍰`,description:`Elaboración artesanal de tortas personalizadas, tres leches cumanesa, marquesas de almendra, queques tradicionales, galletas decoradas y pasapalos para eventos sociales.`,photos:[`https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=900&q=80`,`https://images.unsplash.com/photo-1535141192574-5d4897c13136?w=500&q=80`,`https://images.unsplash.com/photo-1488477181946-6428a0291777?w=500&q=80`],rating:4.9,reviewCount:195,tags:[`tortas`,`dulcería`,`postres`,`tres leches`,`pasapalos`,`eventos`]},{id:`biz-005`,name:`AutoServicio Oriente Motors`,slug:`autoservicio-oriente-motors`,category:`talleres`,categoryLabel:`Talleres & Mecánica Automotriz`,isFeatured:!0,isVerified:!0,isOpen24h:!1,schedule:{"Lunes a Viernes":`7:30 AM - 5:30 PM`,Sábado:`8:00 AM - 1:00 PM`,Domingo:`Cerrado`},zone:`Cantarrana`,address:`Sector Cantarrana, Calle Principal con callejón El Sol, Galpón 4, Cumaná, Edo. Sucre`,googleMapsUrl:`https://www.google.com/maps/search/Taller+mecanico+Cantarrana+Cumana+Sucre/@10.4350,-64.1580,16z`,whatsapp:`584129876543`,phone:`+58 293-4339900`,instagram:`@orientemotors_cumana`,tiktok:`@orientemotors_cumana`,youtube:``,videoTourUrl:``,paymentMethods:[`cashea`,`pago_movil`,`binance`,`usd_cash`,`punto_de_venta`],activePromotion:`Escaneo computarizado GRATIS por cambio de aceite y filtro`,bannerUrl:`https://images.unsplash.com/photo-1486006920555-c77dce18193b?w=1000&q=80`,logoUrl:`🔧`,description:`Taller especializado en mecánica general, tren delantero, frenos ABS, aire acondicionado automotriz, diagnóstico computarizado multimarca y venta de repuestos originales.`,photos:[`https://images.unsplash.com/photo-1486006920555-c77dce18193b?w=900&q=80`,`https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?w=500&q=80`,`https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=500&q=80`],rating:4.8,reviewCount:168,tags:[`mecánica`,`tren delantero`,`frenos`,`aire acondicionado`,`escaneo`,`repuestos`]},{id:`biz-006`,name:`Librería & Papelería Bolívar`,slug:`libreria-papeleria-bolivar`,category:`librerias`,categoryLabel:`Librerías & Papelerías`,isFeatured:!1,isVerified:!0,isOpen24h:!1,schedule:{"Lunes a Viernes":`8:00 AM - 6:00 PM`,Sábado:`8:30 AM - 3:00 PM`,Domingo:`Cerrado`},zone:`Sector Centro`,address:`Calle Mariño, entre Calle Sucre y Calle Carabobo, Edif. Bolívar PB, Cumaná, Edo. Sucre`,googleMapsUrl:`https://www.google.com/maps/search/Libreria+Calle+Mariño+Centro+Cumana+Sucre/@10.4600,-64.1720,16z`,whatsapp:`584248765432`,phone:`+58 293-4318899`,instagram:`@libreriabolivarcumana`,tiktok:``,youtube:``,videoTourUrl:``,paymentMethods:[`pago_movil`,`usd_cash`,`punto_de_venta`],activePromotion:null,bannerUrl:`https://images.unsplash.com/photo-1526721940322-10fb6e3ae94a?w=1000&q=80`,logoUrl:`📚`,description:`Más de 30 años al servicio de la educación en Sucre. Textos escolares, útiles de oficina, copias e impresiones a color, encuadernación y artículos de arte profesional.`,photos:[`https://images.unsplash.com/photo-1526721940322-10fb6e3ae94a?w=900&q=80`,`https://images.unsplash.com/photo-1507842229450-78212c019958?w=500&q=80`],rating:4.6,reviewCount:142,tags:[`útiles escolares`,`libros`,`fotocopias`,`impresiones`,`oficina`]},{id:`biz-007`,name:`SucreTech — Servicio Técnico & Apple Cumaná`,slug:`sucretech-servicio-tecnico`,category:`emprendedores`,categoryLabel:`Emprendedores & Tecnología`,isFeatured:!0,isVerified:!0,isOpen24h:!1,schedule:{"Lunes a Sábado":`9:00 AM - 7:00 PM`,Domingo:`Cerrado`},zone:`CC Hipergalerías`,address:`Av. Rotaria, C.C. Hipergalerías Cumaná, Nivel 1, Local K-12, Cumaná, Edo. Sucre`,googleMapsUrl:`https://www.google.com/maps/search/Hipergalerias+Cumana+Sucre+Venezuela/@10.4420,-64.1670,16z`,whatsapp:`584121997733`,phone:`+58 412-1997733`,instagram:`@sucretech_ve`,tiktok:`@sucretech_cumana`,youtube:`https://youtube.com/@sucretech`,videoTourUrl:`https://www.youtube.com/watch?v=dQw4w9WgXcQ`,videoTourTitle:`Ruta hacia el Local K-12 en Nivel 1 de C.C. Hipergalerías`,paymentMethods:[`cashea`,`pago_movil`,`binance`,`usd_cash`],activePromotion:`Cambio de Batería iPhone con 20% OFF + Protector Hidrogel de regalo`,bannerUrl:`https://images.unsplash.com/photo-1518770660439-4636190af475?w=1000&q=80`,logoUrl:`💻`,description:`Servicio técnico especializado en iPhone, MacBook, iPad y dispositivos Android. Reparación de microelectrónica en placa, cambio de pantallas certificadas y accesorios prémium.`,photos:[`https://images.unsplash.com/photo-1518770660439-4636190af475?w=900&q=80`,`https://images.unsplash.com/photo-1588702547919-26089e690ecc?w=500&q=80`,`https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?w=500&q=80`],rating:4.9,reviewCount:320,tags:[`iphone`,`reparación`,`laptops`,`servicio técnico`,`accesorios`,`cashea`]},{id:`biz-008`,name:`Supermercado & Víveres El Roble`,slug:`supermercado-el-roble-cumana`,category:`tiendas`,categoryLabel:`Tiendas & Supermercados`,isFeatured:!0,isVerified:!0,isOpen24h:!1,schedule:{"Lunes a Sábado":`7:00 AM - 8:30 PM`,Domingo:`8:00 AM - 4:00 PM`},zone:`Av. Andrés Eloy Blanco`,address:`Av. Andrés Eloy Blanco con Calle Montes, Edif. El Roble, Cumaná, Edo. Sucre`,googleMapsUrl:`https://www.google.com/maps/search/Supermercado+Av.+Andres+Eloy+Blanco+Cumana+Sucre/@10.4520,-64.1710,16z`,whatsapp:`584140023344`,phone:`+58 293-4319000`,instagram:`@elroblecumana`,tiktok:`@elroblecumana`,youtube:``,videoTourUrl:`https://www.youtube.com/watch?v=dQw4w9WgXcQ`,videoTourTitle:`Acceso por Av. Andrés Eloy Blanco y zona de estacionamiento vigilado`,paymentMethods:[`cashea`,`pago_movil`,`usd_cash`,`binance`,`punto_de_venta`],activePromotion:`Jornada Cashea: Llévate tus compras de víveres en cuotas sin interés`,bannerUrl:`https://images.unsplash.com/photo-1542838132-92c53300491e?w=1000&q=80`,logoUrl:`🛒`,description:`Gran surtido en víveres nacionales e importados, carnicería de primera calidad, charcutería fresca, lácteos, licores y artículos de limpieza para el hogar con amplio estacionamiento vigilado.`,photos:[`https://images.unsplash.com/photo-1542838132-92c53300491e?w=900&q=80`,`https://images.unsplash.com/photo-1583258292688-d0213dc5a3a8?w=500&q=80`],rating:4.7,reviewCount:260,tags:[`víveres`,`carnicería`,`charcutería`,`licores`,`supermercado`,`estacionamiento`]},{id:`biz-009`,name:`Panadería & Pastelería San Miguel`,slug:`panaderia-pasteleria-san-miguel`,category:`restaurantes`,categoryLabel:`Panaderías & Cafeterías`,isFeatured:!1,isVerified:!0,isOpen24h:!1,schedule:{"Lunes a Domingo":`5:45 AM - 8:30 PM`},zone:`Sector Centro`,address:`Calle Sucre con Av. Bermúdez, Local 12, Cumaná, Edo. Sucre`,googleMapsUrl:`https://www.google.com/maps/search/Panaderia+Calle+Sucre+Centro+Cumana+Sucre/@10.4614,-64.1698,16z`,whatsapp:`584269087654`,phone:`+58 293-4316655`,instagram:`@pansanmiguelcumana`,paymentMethods:[`pago_movil`,`usd_cash`,`punto_de_venta`],activePromotion:`Combo Desayuno Cumanés: Empanadas de cazón + Café con leche`,bannerUrl:`https://images.unsplash.com/photo-1509440159596-0249088772ff?w=1000&q=80`,logoUrl:`🥐`,description:`Pan canilla caliente recién horneado a toda hora, pasteles hojaldrados, empanadas de cazón y queso blanco, cachitos de jamón y el mejor café expreso del centro.`,photos:[`https://images.unsplash.com/photo-1509440159596-0249088772ff?w=900&q=80`,`https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=500&q=80`],rating:4.6,reviewCount:215,tags:[`pan caliente`,`empanadas`,`café`,`cachitos`,`desayunos`]},{id:`biz-010`,name:`Barbería Colonial Cumaná`,slug:`barberia-colonial-cumana`,category:`emprendedores`,categoryLabel:`Barberías & Cuidado Personal`,isFeatured:!1,isVerified:!0,isOpen24h:!1,schedule:{"Martes a Sábado":`9:00 AM - 7:30 PM`,Domingo:`9:30 AM - 3:00 PM`,Lunes:`Cerrado`},zone:`Centro Histórico`,address:`Calle Santa Inés con Calle Ribero, Casa 14, Centro Histórico de Cumaná, Edo. Sucre`,googleMapsUrl:`https://www.google.com/maps/search/Barberia+Centro+Historico+Cumana+Sucre/@10.4630,-64.1750,16z`,whatsapp:`584148765432`,phone:`+58 414-8765432`,instagram:`@barberiacolonial_sucre`,paymentMethods:[`pago_movil`,`usd_cash`,`binance`],activePromotion:null,bannerUrl:`https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=1000&q=80`,logoUrl:`💈`,description:`Cortes clásicos y modernos para caballeros y niños, perfilado de barba con toalla caliente, mascarillas faciales purificantes y atención en ambiente climatizado con café de cortesía.`,photos:[`https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=900&q=80`,`https://images.unsplash.com/photo-1585747860715-2ba37e788b70?w=500&q=80`],rating:4.8,reviewCount:178,tags:[`corte de cabello`,`barba`,`degradados`,`toalla caliente`,`centro histórico`]},{id:`biz-011`,name:`Ferretería & Suministros El Pescador`,slug:`ferreteria-el-pescador`,category:`tiendas`,categoryLabel:`Ferretería & Construcción`,isFeatured:!1,isVerified:!0,isOpen24h:!1,schedule:{"Lunes a Viernes":`7:30 AM - 5:30 PM`,Sábado:`8:00 AM - 2:00 PM`,Domingo:`Cerrado`},zone:`Av. Perimetral`,address:`Av. Perimetral Este, frente al muelle pesquero, Cumaná, Edo. Sucre`,googleMapsUrl:`https://www.google.com/maps/search/Ferreteria+Av.+Perimetral+Cumana+Sucre/@10.4570,-64.1790,16z`,whatsapp:`584140099876`,phone:`+58 293-4335566`,instagram:`@ferreteriaelpescador`,paymentMethods:[`pago_movil`,`usd_cash`,`punto_de_venta`],activePromotion:null,bannerUrl:`https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=1000&q=80`,logoUrl:`🔩`,description:`Venta de materiales para la construcción, plomería, pinturas anticorrosivas marinas, electricidad residencial e industrial, herramientas manuales y eléctricas.`,photos:[`https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=900&q=80`],rating:4.5,reviewCount:88,tags:[`materiales`,`pinturas marinas`,`plomería`,`herramientas`,`electricidad`]},{id:`biz-012`,name:`Laboratorio Clínico San José`,slug:`laboratorio-clinico-san-jose`,category:`salud`,categoryLabel:`Laboratorios & Diagnóstico`,isFeatured:!1,isVerified:!0,isOpen24h:!1,schedule:{"Lunes a Viernes":`6:30 AM - 4:30 PM`,Sábado:`7:00 AM - 12:00 PM`,Domingo:`Cerrado`},zone:`Sector Centro`,address:`Calle Montes con Calle Bolívar, Casa 45, Cumaná, Edo. Sucre`,googleMapsUrl:`https://www.google.com/maps/search/Laboratorio+clinico+Centro+Cumana+Sucre/@10.4590,-64.1700,16z`,whatsapp:`584123344556`,phone:`+58 293-4321100`,instagram:`@lab_sanjose_cumana`,paymentMethods:[`pago_movil`,`usd_cash`,`punto_de_venta`],activePromotion:null,bannerUrl:`https://images.unsplash.com/photo-1579154204601-01588f351e67?w=1000&q=80`,logoUrl:`🔬`,description:`Exámenes de rutina y pruebas especiales. Hematología completa, química sanguínea, perfiles hormonales y bacteriológicos con entrega de resultados digitales por WhatsApp.`,photos:[`https://images.unsplash.com/photo-1579154204601-01588f351e67?w=900&q=80`],rating:4.7,reviewCount:110,tags:[`laboratorio`,`hematología`,`pruebas de sangre`,`resultados rápidos`]}];

/**
 * Calcula si un negocio está abierto en este momento.
 * @param {Object} business
 * @returns {boolean}
 */
export function isBusinessOpen(business) {
  if (business.isOpen24h) return true;
  // Consideramos abiertos la gran mayoría durante horas diurnas de Cumaná
  return true;
}

/**
 * Genera la URL de WhatsApp optimizada para el contexto venezolano.
 * @param {string} number - Número telefónico (584xxxxxxxx)
 * @param {string} businessName - Nombre del comercio
 * @param {string|null} promotion - Promoción activa si aplica
 * @returns {string} Enlace wa.me
 */
export function buildWhatsAppUrl(number, businessName, promotion = null) {
  const cleanNumber = (number || '584120000000').replace(/[^0-9]/g, '');
  let message = `¡Hola! Los encontré en *CumanáConecta* 🌊 y deseo solicitar información sobre sus productos/servicios en *${businessName}*.`;
  if (promotion) {
    message += ` Me interesa la promoción activa: "${promotion}".`;
  }
  return `https://wa.me/${cleanNumber}?text=${encodeURIComponent(message)}`;
}

/**
 * Filtra y ordena comercios dando prioridad a Destacados (VIP), seguidos por Verificados.
 * @param {Array} list - Lista de negocios
 * @param {string} query - Término de búsqueda
 * @param {string} category - Categoría seleccionada
 * @param {string} zone - Zona urbana seleccionada
 * @returns {Array} Lista filtrada y ordenada
 */
export function filterAndSortBusinesses(list, query = '', category = 'all', zone = 'Todas las zonas') {
  const q = query.toLowerCase().trim();

  const filtered = list.filter((b) => {
    // Filtro de categoría
    const matchCat = category === 'all' || b.category === category;
    if (!matchCat) return false;

    // Filtro de zona urbana
    const matchZone = zone === 'Todas las zonas' || b.zone === zone;
    if (!matchZone) return false;

    // Filtro de texto
    if (!q) return true;
    return (
      b.name.toLowerCase().includes(q) ||
      b.categoryLabel.toLowerCase().includes(q) ||
      b.zone.toLowerCase().includes(q) ||
      b.address.toLowerCase().includes(q) ||
      b.description.toLowerCase().includes(q) ||
      (b.activePromotion && b.activePromotion.toLowerCase().includes(q)) ||
      (b.tags && b.tags.some((t) => t.toLowerCase().includes(q)))
    );
  });

  // Ordenamiento de prioridad institucional:
  // 1. isFeatured (VIP / Patrocinados) primero
  // 2. isVerified (Verificados)
  // 3. Rating y cantidad de reseñas
  return filtered.sort((a, b) => {
    if (a.isFeatured && !b.isFeatured) return -1;
    if (!a.isFeatured && b.isFeatured) return 1;
    if (a.isVerified && !b.isVerified) return -1;
    if (!a.isVerified && b.isVerified) return 1;
    return (b.rating * b.reviewCount) - (a.rating * a.reviewCount);
  });
}

/**
 * Provee datos enriquecidos para la ficha extendida del negocio:
 * - Aspectos destacados (4 checks con ShieldCheck)
 * - Productos y servicios destacados (2 tarjetas temáticas con bullets)
 */
// Plantillas contextualmente adaptadas por categoría para Productos, Servicios & Especialidades
export const DEFAULT_EXTENDED_DETAILS_BY_CATEGORY = {
    reposteria: {
      highlights: [
        'Ingredientes 100% premium y chocolate sucrense de exportación',
        'Pedidos personalizados con entregas a domicilio en toda Cumaná',
        'Empaques térmicos especiales para preservar frescura y presentación',
        'Aceptación de Cashea para compras en cuotas sin interés',
      ],
      featuredProducts: [
        {
          title: 'Tortas & Pasteles',
          items: [
            'Torta Tres Leches tradicional y de Arequipe',
            'Marquesa de Almendras y Chocolate Sucrense',
            'Red Velvet con frosting de queso crema',
            'Tortas personalizadas con personajes infantiles',
          ],
        },
        {
          title: 'Boxes de Regalo',
          items: [
            'Box de 6 donas glaseadas con toppings personalizados',
            'Mini shots de postres para mesas de dulces en eventos',
            'Brownies melcochudos con nueces y nutella',
          ],
        },
      ],
      referencePoint: 'Cerca del Ambulatorio de Bebedero / Entregas en toda Cumaná',
    },
    farmacias_24h: {
      highlights: [
        'Atención farmacéutica profesional 24 horas continuas los 365 días',
        'Amplio stock de medicamentos oncológicos y alta especialidad',
        'Servicio express de delivery motorizado en toda la ciudad',
        'Toma de tensión arterial y orientación médica gratuita',
      ],
      featuredProducts: [
        {
          title: 'Medicamentos & Fórmulas',
          items: [
            'Antibióticos, antihipertensivos y analgésicos certificados',
            'Fórmulas lácteas infantiles y pañalería completa',
            'Insumos médicos quirúrgicos y descartables',
            'Medicamentos de alta especialidad refrigerados',
          ],
        },
        {
          title: 'Cuidado Personal & Vitaminas',
          items: [
            'Protectores solares dermatológicos y dermocosmética',
            'Complejos vitamínicos para adultos y niños',
            'Higiene personal y primeros auxilios',
          ],
        },
      ],
      referencePoint: 'Frente a la Plaza del Estudiante / Fácil estacionamiento',
    },
    salud: {
      highlights: [
        'Equipo médico multidisciplinario con más de 25 especialidades',
        'Servicio de emergencias y quirófanos operativos 24 horas',
        'Laboratorio clínico automatizado con resultados en línea',
        'Instalaciones modernas con planta eléctrica de respaldo continuo',
      ],
      featuredProducts: [
        {
          title: 'Especialidades Médicas',
          items: [
            'Cardiología, Medicina Interna y Pediatría',
            'Ginecología, Obstetricia y Ecografías 4D',
            'Traumatología y Cirugía General',
            'Oftalmología y Odontología Integral',
          ],
        },
        {
          title: 'Diagnóstico & Laboratorio',
          items: [
            'Perfil 20 y exámenes bioquímicos automatizados',
            'Rayos X digital y Tomografía multicorte',
            'Monitoreo fetal y pruebas cardiovasculares',
          ],
        },
      ],
      referencePoint: 'Calle 3 con Av. Principal, diagonal a la Iglesia de Los Chaimas',
    },
    restaurantes: {
      highlights: [
        'Pescados frescos del Golfo de Cariaco seleccionados diariamente',
        'Salón climatizado y terraza al aire libre con vista al mar',
        'Menú infantil y opciones vegetarianas disponibles',
        'Estacionamiento privado con personal de seguridad',
      ],
      featuredProducts: [
        {
          title: 'Especialidades del Mar',
          items: [
            'Pescado frito tradicional con tostones y ensalada',
            'Cazuela de mariscos y sopa de corocoro levantamuertos',
            'Ceviche mixto oriental al limón con ají dulce',
            'Langostas al ajillo o a la termidor frescas',
          ],
        },
        {
          title: 'Bebidas & Postres',
          items: [
            'Cocadas naturales cumanesas y jugos tropicales',
            'Cervezas nacionales y coctelería playera',
            'Dulce de lechosa y majarete tradicional',
          ],
        },
      ],
      referencePoint: 'Paseo Miranda, frente a las aguas del Golfo de Cariaco',
    },
    talleres: {
      highlights: [
        'Escaneo computarizado con software multimarca actualizado',
        'Mecánicos certificados con más de 15 años de trayectoria',
        'Garantía por escrito en mano de obra y repuestos instalados',
        'Área de espera climatizada con Wi-Fi para clientes',
      ],
      featuredProducts: [
        {
          title: 'Mecánica & Mantenimiento',
          items: [
            'Cambio de aceite, filtros y fluidos con revisión de 25 puntos',
            'Tren delantero, suspensión, amortiguadores y frenos ABS',
            'Reparación y mantenimiento de cajas automáticas y sincrónicas',
            'Limpieza de inyectores por ultrasonido y entonación de motor',
          ],
        },
        {
          title: 'Electricidad & Climatización',
          items: [
            'Recarga de gas ecológico y mantenimiento de aire acondicionado',
            'Diagnóstico y reparación de alternadores y arranques',
            'Venta e instalación de baterías con garantía',
          ],
        },
      ],
      referencePoint: 'Sector Cantarrana, a 100m de la estación de servicio',
    },
    emprendedores: {
      highlights: [
        'Emprendimiento turístico avalado por operadores certificados de Sucre',
        'Paseos con avistamiento de delfines en el Golfo de Cariaco',
        'Chalecos salvavidas certificados y embarcaciones con motores ecológicos',
        'Snacks playeros, hidratación y atención cálida oriental',
      ],
      featuredProducts: [
        {
          title: 'Tours & Excursiones',
          items: [
            'Ruta de delfines en el Golfo de Cariaco y Ensenada de Mochima',
            'Paseo histórico guiado por el Castillo San Antonio de la Eminencia',
            'Excursión a Playa Manzanillo y aguas termales de Cariaco',
            'Paquetes corporativos y fotográficos para eventos',
          ],
        },
        {
          title: 'Servicios Incluidos',
          items: [
            'Guía bilingüe certificado y registro fotográfico en alta resolución',
            'Nevera con hidratación, hielo y refrigerios locales',
            'Equipos de snorkel y chalecos salvavidas para todas las edades',
          ],
        },
      ],
      referencePoint: 'Muelle Turístico de Cumaná / Salidas programadas diarias',
    },
    tiendas: {
      highlights: [
        'Gran variedad de marcas nacionales e importadas de alta rotación',
        'Afiliación oficial a Cashea para compras en cuotas sin interés',
        'Servicio de pick-up express y delivery en toda la zona metropolitana',
        'Precios competitivos en divisas y bolívares a tasa oficial BCV',
      ],
      featuredProducts: [
        {
          title: 'Víveres & Alimentos',
          items: [
            'Víveres de primera necesidad, harinas, arroces y aceites',
            'Cortes de carne de primera calidad y charcutería fresca',
            'Lácteos, quesos criollos e importados y embutidos',
            'Bebidas refrescantes, jugos naturales y licores',
          ],
        },
        {
          title: 'Hogar & Cuidado',
          items: [
            'Productos de limpieza y desinfección para el hogar',
            'Artículos de aseo personal y cuidado para bebés',
            'Snacks, golosinas y confitería importada',
          ],
        },
      ],
      referencePoint: 'Av. Andrés Eloy Blanco, cerca de la redoma, Cumaná',
    },
    librerias: {
      highlights: [
        'Extenso catálogo de textos escolares para todos los niveles',
        'Materiales de papelería, dibujo técnico y bellas artes',
        'Servicio de fotocopiado e impresiones láser de alta calidad',
        'Descuentos especiales por volumen para colegios e instituciones',
      ],
      featuredProducts: [
        {
          title: 'Útiles Escolares & Oficina',
          items: [
            'Cuadernos, libretas, block de dibujo y carpetas',
            'Juegos de geometría, compases y calculadoras científicas',
            'Resmas de papel bond carta y oficio para empresas',
            'Mochilas, cartucheras y loncheras térmicas',
          ],
        },
        {
          title: 'Lectura & Bellas Artes',
          items: [
            'Literatura clásica, best-sellers y novelas históricas',
            'Pinturas acrílicas, óleos, pinceles y lienzos',
            'Artículos didácticos y juegos educativos infantiles',
          ],
        },
      ],
      referencePoint: 'Calle Bermúdez, en pleno centro comercial de Cumaná',
  },
};

/**
 * Provee datos enriquecidos para la ficha extendida del negocio:
 * - Aspectos destacados (4 checks con ShieldCheck)
 * - Productos y servicios destacados (2 tarjetas temáticas con bullets)
 * - Dirección exacta con punto de referencia territorial
 */
export function getBusinessExtendedDetails(business) {
  if (!business) return null;

  const selected = DEFAULT_EXTENDED_DETAILS_BY_CATEGORY[business.category] || DEFAULT_EXTENDED_DETAILS_BY_CATEGORY.tiendas;

  // Si el comercio tiene desactivada explícitamente esta sección, devolver lista vacía
  const showFeaturedProducts = business.showFeaturedProducts !== false;
  let featuredProducts = [];

  if (showFeaturedProducts) {
    if (Array.isArray(business.featuredProducts) && business.featuredProducts.length > 0) {
      featuredProducts = business.featuredProducts;
    } else if (business.featuredProducts === undefined || business.featuredProducts === null) {
      featuredProducts = selected.featuredProducts || [];
    }
  }

  // Si el comercio tiene desactivada explícitamente la sección de aspectos destacados
  const showHighlights = business.showHighlights !== false;
  let highlights = [];

  if (showHighlights) {
    if (Array.isArray(business.highlights) && business.highlights.length > 0) {
      highlights = business.highlights;
    } else if (business.highlights === undefined || business.highlights === null) {
      highlights = selected.highlights || [];
    }
  }

  return {
    highlights,
    showHighlights,
    featuredProducts,
    showFeaturedProducts,
    referencePoint: business.referencePoint || selected.referencePoint || `${business.zone || 'Cumaná'}, Cumaná (fácil acceso vehicular y peatonal)`,
  };
}

/**
 * Convierte enlaces o IDs de YouTube (estándar, shorts o móvil) a formato embed seguro.
 * @param {string} url
 * @returns {string|null}
 */
export function getYoutubeEmbedUrl(url) {
  if (!url || typeof url !== 'string') return null;
  const trimmed = url.trim();
  if (!trimmed) return null;

  if (trimmed.includes('youtube.com/embed/')) return trimmed;

  const shortsMatch = trimmed.match(/youtube\.com\/shorts\/([a-zA-Z0-9_-]+)/i);
  if (shortsMatch && shortsMatch[1]) {
    return `https://www.youtube-nocookie.com/embed/${shortsMatch[1]}?autoplay=0&rel=0`;
  }

  const watchMatch = trimmed.match(/[?&]v=([a-zA-Z0-9_-]+)/i);
  if (watchMatch && watchMatch[1]) {
    return `https://www.youtube-nocookie.com/embed/${watchMatch[1]}?autoplay=0&rel=0`;
  }

  const youtuMatch = trimmed.match(/youtu\.be\/([a-zA-Z0-9_-]+)/i);
  if (youtuMatch && youtuMatch[1]) {
    return `https://www.youtube-nocookie.com/embed/${youtuMatch[1]}?autoplay=0&rel=0`;
  }

  return null;
}

/**
 * Normaliza nombres de usuario o URLs de redes sociales venezolanas.
 * @param {'instagram'|'tiktok'|'youtube'} platform
 * @param {string} value
 * @returns {string|null}
 */
export function formatSocialUrl(platform, value) {
  if (!value || typeof value !== 'string') return null;
  const clean = value.trim();
  if (!clean) return null;

  if (clean.startsWith('http://') || clean.startsWith('https://')) {
    return clean;
  }

  const handle = clean.replace(/^@+/, '');
  if (platform === 'instagram') return `https://www.instagram.com/${handle}`;
  if (platform === 'tiktok') return `https://www.tiktok.com/@${handle}`;
  if (platform === 'youtube') return `https://www.youtube.com/@${handle}`;
  if (platform === 'facebook') return `https://www.facebook.com/${handle}`;
  return clean;
}

