--
-- PostgreSQL database dump
--

-- Dumped from database version 16.9 (Debian 16.9-1.pgdg120+1)
-- Dumped by pg_dump version 16.9 (Debian 16.9-1.pgdg120+1)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: public; Type: SCHEMA; Schema: -; Owner: postgres
--

-- *not* creating schema, since initdb creates it


ALTER SCHEMA public OWNER TO postgres;

--
-- Name: SCHEMA public; Type: COMMENT; Schema: -; Owner: postgres
--

COMMENT ON SCHEMA public IS '';


--
-- Name: OrderStatus; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."OrderStatus" AS ENUM (
    'PAID',
    'FAILED',
    'PENDING',
    'CONFIRMED',
    'PROCESSING',
    'SHIPPED',
    'DELIVERED',
    'CANCELLED'
);


ALTER TYPE public."OrderStatus" OWNER TO postgres;

--
-- Name: ProductAttributeType; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."ProductAttributeType" AS ENUM (
    'STRING',
    'NUMBER',
    'BOOLEAN'
);


ALTER TYPE public."ProductAttributeType" OWNER TO postgres;

--
-- Name: UserRole; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."UserRole" AS ENUM (
    'CUSTOMER',
    'ADMIN'
);


ALTER TYPE public."UserRole" OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: Banners; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Banners" (
    id text NOT NULL,
    title text,
    description text,
    image_url text,
    url_link text,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(3) without time zone NOT NULL,
    display_on text DEFAULT 'HOME'::text
);


ALTER TABLE public."Banners" OWNER TO postgres;

--
-- Name: Cart; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Cart" (
    cart_id text NOT NULL,
    user_id text NOT NULL,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."Cart" OWNER TO postgres;

--
-- Name: CartItem; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."CartItem" (
    cart_item_id text NOT NULL,
    cart_id text NOT NULL,
    product_id text NOT NULL,
    quantity integer NOT NULL
);


ALTER TABLE public."CartItem" OWNER TO postgres;

--
-- Name: Category; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Category" (
    category_id text NOT NULL,
    name text NOT NULL,
    image text
);


ALTER TABLE public."Category" OWNER TO postgres;

--
-- Name: CategoryAttribute; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."CategoryAttribute" (
    id text NOT NULL,
    category_id text NOT NULL,
    attribute_id text NOT NULL
);


ALTER TABLE public."CategoryAttribute" OWNER TO postgres;

--
-- Name: Coupon; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Coupon" (
    code text NOT NULL,
    discount double precision NOT NULL,
    expires_at timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."Coupon" OWNER TO postgres;

--
-- Name: Order; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Order" (
    order_id text NOT NULL,
    user_id text NOT NULL,
    total double precision NOT NULL,
    status public."OrderStatus" DEFAULT 'PENDING'::public."OrderStatus" NOT NULL,
    shipping_address_id text,
    tracking_code text,
    stripe_session_id text,
    stripe_payment_intent_id text,
    url_payment text,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(3) without time zone NOT NULL,
    "couponCode" text,
    "shippingMethodId" text
);


ALTER TABLE public."Order" OWNER TO postgres;

--
-- Name: OrderItem; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."OrderItem" (
    order_item_id text NOT NULL,
    order_id text NOT NULL,
    product_id text NOT NULL,
    quantity integer NOT NULL,
    unit_price double precision NOT NULL
);


ALTER TABLE public."OrderItem" OWNER TO postgres;

--
-- Name: Product; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Product" (
    product_id text NOT NULL,
    name text NOT NULL,
    price double precision NOT NULL,
    discount double precision DEFAULT 0,
    description text,
    stock integer NOT NULL,
    sku text NOT NULL,
    category_id text,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."Product" OWNER TO postgres;

--
-- Name: ProductAttribute; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."ProductAttribute" (
    attribute_id text NOT NULL,
    name text NOT NULL,
    unit text,
    type public."ProductAttributeType" DEFAULT 'STRING'::public."ProductAttributeType" NOT NULL
);


ALTER TABLE public."ProductAttribute" OWNER TO postgres;

--
-- Name: ProductAttributeValue; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."ProductAttributeValue" (
    value_id text NOT NULL,
    product_id text NOT NULL,
    attribute_id text NOT NULL,
    value text NOT NULL
);


ALTER TABLE public."ProductAttributeValue" OWNER TO postgres;

--
-- Name: ProductImage; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."ProductImage" (
    image_id text NOT NULL,
    product_id text NOT NULL,
    url text NOT NULL,
    "primary" boolean DEFAULT false NOT NULL
);


ALTER TABLE public."ProductImage" OWNER TO postgres;

--
-- Name: RefreshToken; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."RefreshToken" (
    id text NOT NULL,
    user_id text NOT NULL,
    token text NOT NULL,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    expires_at timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."RefreshToken" OWNER TO postgres;

--
-- Name: Review; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Review" (
    id text NOT NULL,
    user_id text NOT NULL,
    product_id text NOT NULL,
    rating integer NOT NULL,
    comment text,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public."Review" OWNER TO postgres;

--
-- Name: ShippingMethod; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."ShippingMethod" (
    id text NOT NULL,
    name text NOT NULL,
    price double precision NOT NULL,
    estimated_days integer NOT NULL
);


ALTER TABLE public."ShippingMethod" OWNER TO postgres;

--
-- Name: User; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."User" (
    user_id text NOT NULL,
    email text NOT NULL,
    name text,
    password text NOT NULL,
    phone text,
    role public."UserRole" DEFAULT 'CUSTOMER'::public."UserRole" NOT NULL,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."User" OWNER TO postgres;

--
-- Name: UserAddress; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."UserAddress" (
    address_id text NOT NULL,
    user_id text NOT NULL,
    street text NOT NULL,
    number text,
    city text NOT NULL,
    state text NOT NULL,
    zip_code text NOT NULL,
    complement text
);


ALTER TABLE public."UserAddress" OWNER TO postgres;

--
-- Name: Wishlist; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Wishlist" (
    id text NOT NULL,
    user_id text NOT NULL,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."Wishlist" OWNER TO postgres;

--
-- Name: WishlistItem; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."WishlistItem" (
    id text NOT NULL,
    wishlist_id text NOT NULL,
    product_id text NOT NULL
);


ALTER TABLE public."WishlistItem" OWNER TO postgres;

--
-- Name: _prisma_migrations; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public._prisma_migrations (
    id character varying(36) NOT NULL,
    checksum character varying(64) NOT NULL,
    finished_at timestamp with time zone,
    migration_name character varying(255) NOT NULL,
    logs text,
    rolled_back_at timestamp with time zone,
    started_at timestamp with time zone DEFAULT now() NOT NULL,
    applied_steps_count integer DEFAULT 0 NOT NULL
);


ALTER TABLE public._prisma_migrations OWNER TO postgres;

--
-- Data for Name: Banners; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Banners" (id, title, description, image_url, url_link, created_at, updated_at, display_on) FROM stdin;
70d55087-e6d4-4a87-b44d-1ff56178cbf6	Banner 1 - Home	\N	https://d1bbbbpdvc.ufs.sh/f/LGdFo64y06eK2TW8j7bdqhVtIQYB4rcOeDu1HLJo0xm5Gl68	\N	2025-07-22 20:23:45.486	2025-07-22 20:23:30.874	HOME
e2b53529-e3c1-4e11-95bb-9bb8b08dda73	Banner 2 - Home	\N	https://d1bbbbpdvc.ufs.sh/f/LGdFo64y06eKoM7h1rRl8BJmgPAKdVb0R2ywpEv4xaWiIzk7	\N	2025-07-22 20:23:57.322	2025-07-22 20:23:46.497	HOME
24e91d53-b27d-4681-8489-dfd3335e1f16	Banner 3 - Home	\N	https://d1bbbbpdvc.ufs.sh/f/LGdFo64y06eKPlypmKU9Kvt0USiMOYoLgmacCe8f1jwQ3Jyz	\N	2025-07-22 20:24:07.685	2025-07-22 20:24:01.173	HOME
\.


--
-- Data for Name: Cart; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Cart" (cart_id, user_id, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: CartItem; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."CartItem" (cart_item_id, cart_id, product_id, quantity) FROM stdin;
\.


--
-- Data for Name: Category; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Category" (category_id, name, image) FROM stdin;
af223a19-066b-4790-bef3-29c9848067b4	Console	https://d1bbbbpdvc.ufs.sh/f/LGdFo64y06eKGPcfUGsnJg8Kvx5sAR9O176LuISDUinom2dW
13a36e2e-cb21-41f6-84e0-f53112906ac4	Mouse	https://d1bbbbpdvc.ufs.sh/f/LGdFo64y06eKQKR8rTpLsP8H0263oGKzwdviIXYumBf4WJFt
2c992ca6-bdfd-4006-aee3-7bb8ea97edf9	Cadeira	https://d1bbbbpdvc.ufs.sh/f/LGdFo64y06eKtBtPLDYsCNOrQyLBM7kGHZXjFPowS9Aa2ldt
d8855725-6ad9-4a69-8293-da054fa2e9cd	Headset	https://d1bbbbpdvc.ufs.sh/f/LGdFo64y06eKTkvqhE0QCXkzaWyjFufKTv3H9m2JBstcpbwG
8bee5522-3be3-4957-bfe6-57025a099155	Teclado	https://d1bbbbpdvc.ufs.sh/f/LGdFo64y06eKGTojvrnJg8Kvx5sAR9O176LuISDUinom2dWq
1df71864-d9da-4ca5-8658-48161325203a	Mousepad	https://d1bbbbpdvc.ufs.sh/f/LGdFo64y06eKMyRDu7SzhWlys1aCDYAMo5rdPubx7ve6LOXG
c8441818-82c6-4ef3-a141-4cff316b6725	Computador	https://d1bbbbpdvc.ufs.sh/f/LGdFo64y06eKCpQvSupq1K54e0AnU2TDJwum8zOxa3Z6XYqB
9c1f1c46-0be8-4e3b-888e-b889d5ad6f05	Placa de V├¡deo	https://d1bbbbpdvc.ufs.sh/f/LGdFo64y06eKXVaVrFuBYs0iuOhTrm7Qc41RMfgaC86FNpyU
19a22e17-cd39-472f-814c-0b5f9e0779cf	Monitor	https://d1bbbbpdvc.ufs.sh/f/LGdFo64y06eK5VbHecCTgQ9cpyVdFbEUWM3KL6GXB8mYe0Hv
\.


--
-- Data for Name: CategoryAttribute; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."CategoryAttribute" (id, category_id, attribute_id) FROM stdin;
\.


--
-- Data for Name: Coupon; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Coupon" (code, discount, expires_at) FROM stdin;
\.


--
-- Data for Name: Order; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Order" (order_id, user_id, total, status, shipping_address_id, tracking_code, stripe_session_id, stripe_payment_intent_id, url_payment, created_at, updated_at, "couponCode", "shippingMethodId") FROM stdin;
\.


--
-- Data for Name: OrderItem; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."OrderItem" (order_item_id, order_id, product_id, quantity, unit_price) FROM stdin;
\.


--
-- Data for Name: Product; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Product" (product_id, name, price, discount, description, stock, sku, category_id, created_at, updated_at) FROM stdin;
059b30ec-ddc8-4cb2-a752-3f1ad4419541	Cadeira Office DT3 Helora Preta	2552.93	12	Lorem ipsum dolor sit amet consectetur adipisicing elit. Quae iusto consequuntur, harum aspernatur odit deserunt incidunt at, quibusdam ipsa id, accusantium alias ab minus ad ratione eaque quisquam suscipit labore debitis veritatis? Non expedita exercitationem totam reiciendis alias eligendi, quas libero placeat voluptate consequatur laboriosam atque amet sequi ipsam, qui quae hic, laborum recusandae sed quo accusantium deleniti ab? Qui, quod! Quod quisquam repellendus nam iure, autem quas vel blanditiis. Similique provident molestiae odio libero. Aperiam perspiciatis vero ea similique illum ducimus sapiente debitis fugit fugiat, necessitatibus recusandae repellat, obcaecati porro quidem aliquam commodi iste, temporibus ratione ipsum? Doloribus ipsum,	42	CADEI-OF999	2c992ca6-bdfd-4006-aee3-7bb8ea97edf9	2025-07-27 19:40:54.015	2025-07-27 20:17:45.426
0c9089b6-5705-4c1f-9cb6-56476b790901	Mouse Gamer Razer Deathadder V3 Pro, Wireless, 30000DPI, 5 Botoes, Preto	2705.87	62	Lorem ipsum dolor sit amet consectetur adipisicing elit. Quae iusto consequuntur, harum aspernatur odit deserunt incidunt at, quibusdam ipsa id, accusantium alias ab minus ad ratione eaque quisquam suscipit labore debitis veritatis? Non expedita exercitationem totam reiciendis alias eligendi, quas libero placeat voluptate consequatur laboriosam atque amet sequi ipsam, qui quae hic, laborum recusandae sed quo accusantium deleniti ab? Qui, quod! Quod quisquam repellendus nam iure, autem quas vel blanditiis. Similique provident molestiae odio libero. Aperiam perspiciatis vero ea similique illum ducimus sapiente debitis fugit fugiat, necessitatibus recusandae repellat, obcaecati porro quidem aliquam commodi iste, temporibus ratione ipsum? Doloribus ipsum,	999	MOU-997	13a36e2e-cb21-41f6-84e0-f53112906ac4	2025-07-21 00:59:42.759	2025-07-27 20:17:45.426
11e9de64-8e58-45d9-a58f-9200eee83f71	PC Gamer Pichau Highflyer, AMD Ryzen 7 9700X, Radeon RX 7800 XT 16GB, 32GB DDR5, SSD M.2 2TB	22301.99	56	Lorem ipsum dolor sit amet consectetur adipisicing elit. Quae iusto consequuntur, harum aspernatur odit deserunt incidunt at, quibusdam ipsa id, accusantium alias ab minus ad ratione eaque quisquam suscipit labore debitis veritatis? Non expedita exercitationem totam reiciendis alias eligendi, quas libero placeat voluptate consequatur laboriosam atque amet sequi ipsam, qui quae hic, laborum recusandae sed quo accusantium deleniti ab? Qui, quod! Quod quisquam repellendus nam iure, autem quas vel blanditiis. Similique provident molestiae odio libero. Aperiam perspiciatis vero ea similique illum ducimus sapiente debitis fugit fugiat, necessitatibus recusandae repellat, obcaecati porro quidem aliquam commodi iste, temporibus ratione ipsum? Doloribus ipsum,	2	PC-GAMER-381	c8441818-82c6-4ef3-a141-4cff316b6725	2025-07-27 19:44:44.424	2025-07-27 20:17:45.426
1526a09d-7477-400f-895f-e593de78e551	Teclado Gamer Redragon Shiva 98, RGB, ABNT2, Preto, K515-RGB-PT	159	53	Lorem ipsum dolor sit amet consectetur adipisicing elit. Quae iusto consequuntur, harum aspernatur odit deserunt incidunt at, quibusdam ipsa id, accusantium alias ab minus ad ratione eaque quisquam suscipit labore debitis veritatis? Non expedita exercitationem totam reiciendis alias eligendi, quas libero placeat voluptate consequatur laboriosam atque amet sequi ipsam, qui quae hic, laborum recusandae sed quo accusantium deleniti ab? Qui, quod! Quod quisquam repellendus nam iure, autem quas vel blanditiis. Similique provident molestiae odio libero. Aperiam perspiciatis vero ea similique illum ducimus sapiente debitis fugit fugiat, necessitatibus recusandae repellat, obcaecati porro quidem aliquam commodi iste, temporibus ratione ipsum? Doloribus ipsum,	12	TECLADO-127	8bee5522-3be3-4957-bfe6-57025a099155	2025-07-27 19:54:26.254	2025-07-27 20:17:45.426
205d1607-155a-4140-9434-cce519bbd934	Headset Gamer Corsair Virtuoso RGB Wireless Preto 7.1 Drivers 50mm, CA-9011185-NA	980.08	35	Lorem ipsum dolor sit amet consectetur adipisicing elit. Quae iusto consequuntur, harum aspernatur odit deserunt incidunt at, quibusdam ipsa id, accusantium alias ab minus ad ratione eaque quisquam suscipit labore debitis veritatis? Non expedita exercitationem totam reiciendis alias eligendi, quas libero placeat voluptate consequatur laboriosam atque amet sequi ipsam, qui quae hic, laborum recusandae sed quo accusantium deleniti ab? Qui, quod! Quod quisquam repellendus nam iure, autem quas vel blanditiis. Similique provident molestiae odio libero. Aperiam perspiciatis vero ea similique illum ducimus sapiente debitis fugit fugiat, necessitatibus recusandae repellat, obcaecati porro quidem aliquam commodi iste, temporibus ratione ipsum? Doloribus ipsum,	12	HEADSET-1291	d8855725-6ad9-4a69-8293-da054fa2e9cd	2025-07-27 19:49:31.483	2025-07-27 20:17:45.426
27dafb00-2e08-417d-97fa-4548e0a4a0e9	Monitor Gamer Gigabyte GS34WQC, 34 Pol, Curvo, VA, WQHD, 1ms, 120Hz, DP/HDMI, GS34WQC	3201.98	20	Lorem ipsum dolor sit amet consectetur adipisicing elit. Quae iusto consequuntur, harum aspernatur odit deserunt incidunt at, quibusdam ipsa id, accusantium alias ab minus ad ratione eaque quisquam suscipit labore debitis veritatis? Non expedita exercitationem totam reiciendis alias eligendi, quas libero placeat voluptate consequatur laboriosam atque amet sequi ipsam, qui quae hic, laborum recusandae sed quo accusantium deleniti ab? Qui, quod! Quod quisquam repellendus nam iure, autem quas vel blanditiis. Similique provident molestiae odio libero. Aperiam perspiciatis vero ea similique illum ducimus sapiente debitis fugit fugiat, necessitatibus recusandae repellat, obcaecati porro quidem aliquam commodi iste, temporibus ratione ipsum? Doloribus ipsum,	97	MONITOR-921	19a22e17-cd39-472f-814c-0b5f9e0779cf	2025-07-27 19:52:39.954	2025-07-27 20:17:45.426
2808ca15-b08c-4376-9dc0-585a204040a2	Cadeira Gamer Mancer Ymir, Branco e Rosa, MCR-YMR-WPK	649.98	12	Lorem ipsum dolor sit amet consectetur adipisicing elit. Quae iusto consequuntur, harum aspernatur odit deserunt incidunt at, quibusdam ipsa id, accusantium alias ab minus ad ratione eaque quisquam suscipit labore debitis veritatis? Non expedita exercitationem totam reiciendis alias eligendi, quas libero placeat voluptate consequatur laboriosam atque amet sequi ipsam, qui quae hic, laborum recusandae sed quo accusantium deleniti ab? Qui, quod! Quod quisquam repellendus nam iure, autem quas vel blanditiis. Similique provident molestiae odio libero. Aperiam perspiciatis vero ea similique illum ducimus sapiente debitis fugit fugiat, necessitatibus recusandae repellat, obcaecati porro quidem aliquam commodi iste, temporibus ratione ipsum? Doloribus ipsum,	32	CADEI-MAN-973	2c992ca6-bdfd-4006-aee3-7bb8ea97edf9	2025-07-27 19:42:21.676	2025-07-27 20:17:45.426
a0800e10-205e-48c7-bc1f-42013cdf2a5c	Headset Gamer Corsair HS65 Wireless, Surround 7.1, Drivers 50mm, Preto, CA-9011285-NA2	780.98	76	Lorem ipsum dolor sit amet consectetur adipisicing elit. Quae iusto consequuntur, harum aspernatur odit deserunt incidunt at, quibusdam ipsa id, accusantium alias ab minus ad ratione eaque quisquam suscipit labore debitis veritatis? Non expedita exercitationem totam reiciendis alias eligendi, quas libero placeat voluptate consequatur laboriosam atque amet sequi ipsam, qui quae hic, laborum recusandae sed quo accusantium deleniti ab? Qui, quod! Quod quisquam repellendus nam iure, autem quas vel blanditiis. Similique provident molestiae odio libero. Aperiam perspiciatis vero ea similique illum ducimus sapiente debitis fugit fugiat, necessitatibus recusandae repellat, obcaecati porro quidem aliquam commodi iste, temporibus ratione ipsum? Doloribus ipsum,	178	HEADESET-2182	d8855725-6ad9-4a69-8293-da054fa2e9cd	2025-07-27 19:50:14.617	2025-07-27 20:17:45.426
5b43d682-2acb-4e86-bfbf-c3e6b25e8395	PC Gamer Pichau Fuzhu XII, Intel i7-12700F, GeForce RTX 5060 Ti 16GB, 32GB DDR5, SSD M.2 1TB	12021.99	20	Lorem ipsum dolor sit amet consectetur adipisicing elit. Quae iusto consequuntur, harum aspernatur odit deserunt incidunt at, quibusdam ipsa id, accusantium alias ab minus ad ratione eaque quisquam suscipit labore debitis veritatis? Non expedita exercitationem totam reiciendis alias eligendi, quas libero placeat voluptate consequatur laboriosam atque amet sequi ipsam, qui quae hic, laborum recusandae sed quo accusantium deleniti ab? Qui, quod! Quod quisquam repellendus nam iure, autem quas vel blanditiis. Similique provident molestiae odio libero. Aperiam perspiciatis vero ea similique illum ducimus sapiente debitis fugit fugiat, necessitatibus recusandae repellat, obcaecati porro quidem aliquam commodi iste, temporibus ratione ipsum? Doloribus ipsum,	42	PC-GAMER-112	c8441818-82c6-4ef3-a141-4cff316b6725	2025-07-27 19:46:15.404	2025-07-27 20:17:45.426
91be7320-3120-46af-b707-cfb4f8672fcd	Controle Microsoft Xbox Velocity Green, Wireless, Verde, EP2-29915	489.99	15	Lorem ipsum dolor sit amet consectetur adipisicing elit. Quae iusto consequuntur, harum aspernatur odit deserunt incidunt at, quibusdam ipsa id, accusantium alias ab minus ad ratione eaque quisquam suscipit labore debitis veritatis? Non expedita exercitationem totam reiciendis alias eligendi, quas libero placeat voluptate consequatur laboriosam atque amet sequi ipsam, qui quae hic, laborum recusandae sed quo accusantium deleniti ab? Qui, quod! Quod quisquam repellendus nam iure, autem quas vel blanditiis. Similique provident molestiae odio libero. Aperiam perspiciatis vero ea similique illum ducimus sapiente debitis fugit fugiat, necessitatibus recusandae repellat, obcaecati porro quidem aliquam commodi iste, temporibus ratione ipsum? Doloribus ipsum,	1	CONTROL-2912	af223a19-066b-4790-bef3-29c9848067b4	2025-07-27 19:47:58.071	2025-07-27 20:17:45.426
64067de4-62c6-40a8-9634-72f425968e25	Mousepad Aigo DarkFlash Flex 800 RGB 800x300x4mm	229.4	20	Lorem ipsum dolor sit amet consectetur adipisicing elit. Quae iusto consequuntur, harum aspernatur odit deserunt incidunt at, quibusdam ipsa id, accusantium alias ab minus ad ratione eaque quisquam suscipit labore debitis veritatis? Non expedita exercitationem totam reiciendis alias eligendi, quas libero placeat voluptate consequatur laboriosam atque amet sequi ipsam, qui quae hic, laborum recusandae sed quo accusantium deleniti ab? Qui, quod! Quod quisquam repellendus nam iure, autem quas vel blanditiis. Similique provident molestiae odio libero. Aperiam perspiciatis vero ea similique illum ducimus sapiente debitis fugit fugiat, necessitatibus recusandae repellat, obcaecati porro quidem aliquam commodi iste, temporibus ratione ipsum? Doloribus ipsum,	999	MOUPAD-999	1df71864-d9da-4ca5-8658-48161325203a	2025-07-21 00:51:39.293	2025-07-27 20:17:45.426
453d0fb6-8ba7-4117-8318-030068822fbe	Placa de Video Gainward GeForce RTX 5060 Ghost, 8GB, GDDR7, 128-bit	2599.99	30	Lorem ipsum dolor sit amet consectetur adipisicing elit. Quae iusto consequuntur, harum aspernatur odit deserunt incidunt at, quibusdam ipsa id, accusantium alias ab minus ad ratione eaque quisquam suscipit labore debitis veritatis? Non expedita exercitationem totam reiciendis alias eligendi, quas libero placeat voluptate consequatur laboriosam atque amet sequi ipsam, qui quae hic, laborum recusandae sed quo accusantium deleniti ab? Qui, quod! Quod quisquam repellendus nam iure, autem quas vel blanditiis. Similique provident molestiae odio libero. Aperiam perspiciatis vero ea similique illum ducimus sapiente debitis fugit fugiat, necessitatibus recusandae repellat, obcaecati porro quidem aliquam commodi iste, temporibus ratione ipsum? Doloribus ipsum,	999	PVID-937	9c1f1c46-0be8-4e3b-888e-b889d5ad6f05	2025-07-21 00:54:58.751	2025-07-27 20:17:45.426
2ce1a6bc-afb6-4403-bafc-6dd285f868be	Mouse Gamer Redragon K1ng 8K, 26000DPI, 5 Botoes, Preto	352.93	15	Lorem ipsum dolor sit amet consectetur adipisicing elit. Quae iusto consequuntur, harum aspernatur odit deserunt incidunt at, quibusdam ipsa id, accusantium alias ab minus ad ratione eaque quisquam suscipit labore debitis veritatis? Non expedita exercitationem totam reiciendis alias eligendi, quas libero placeat voluptate consequatur laboriosam atque amet sequi ipsam, qui quae hic, laborum recusandae sed quo accusantium deleniti ab? Qui, quod! Quod quisquam repellendus nam iure, autem quas vel blanditiis. Similique provident molestiae odio libero. Aperiam perspiciatis vero ea similique illum ducimus sapiente debitis fugit fugiat, necessitatibus recusandae repellat, obcaecati porro quidem aliquam commodi iste, temporibus ratione ipsum? Doloribus ipsum,	999	MOU-999	13a36e2e-cb21-41f6-84e0-f53112906ac4	2025-07-20 22:52:19.877	2025-07-27 20:17:45.426
aed59157-6c9c-45cc-a6e0-497f1b85e6d2	Cadeira Gamer Acegeek Knight-V2, RGB, Preto, AG-KNIGHT-V2-BK	1148.97	15	Lorem ipsum dolor sit amet consectetur adipisicing elit. Quae iusto consequuntur, harum aspernatur odit deserunt incidunt at, quibusdam ipsa id, accusantium alias ab minus ad ratione eaque quisquam suscipit labore debitis veritatis? Non expedita exercitationem totam reiciendis alias eligendi, quas libero placeat voluptate consequatur laboriosam atque amet sequi ipsam, qui quae hic, laborum recusandae sed quo accusantium deleniti ab? Qui, quod! Quod quisquam repellendus nam iure, autem quas vel blanditiis. Similique provident molestiae odio libero. Aperiam perspiciatis vero ea similique illum ducimus sapiente debitis fugit fugiat, necessitatibus recusandae repellat, obcaecati porro quidem aliquam commodi iste, temporibus ratione ipsum? Doloribus ipsum,	6	CADEI-ACE-372	2c992ca6-bdfd-4006-aee3-7bb8ea97edf9	2025-07-27 19:43:28.529	2025-07-27 20:17:45.426
b076aa00-84af-46c3-97c7-bbd6e55ace59	PC Gamer Pichau Saiph IV, AMD Ryzen 7 5800X, Radeon RX 7800 XT 16GB, 32GB DDR4, SSD M.2 1TB	11012.99	15	Lorem ipsum dolor sit amet consectetur adipisicing elit. Quae iusto consequuntur, harum aspernatur odit deserunt incidunt at, quibusdam ipsa id, accusantium alias ab minus ad ratione eaque quisquam suscipit labore debitis veritatis? Non expedita exercitationem totam reiciendis alias eligendi, quas libero placeat voluptate consequatur laboriosam atque amet sequi ipsam, qui quae hic, laborum recusandae sed quo accusantium deleniti ab? Qui, quod! Quod quisquam repellendus nam iure, autem quas vel blanditiis. Similique provident molestiae odio libero. Aperiam perspiciatis vero ea similique illum ducimus sapiente debitis fugit fugiat, necessitatibus recusandae repellat, obcaecati porro quidem aliquam commodi iste, temporibus ratione ipsum? Doloribus ipsum,	21	PC-GAMER-829	c8441818-82c6-4ef3-a141-4cff316b6725	2025-07-27 19:46:59.134	2025-07-27 20:17:45.426
cf8a90fc-9d74-4fbe-a3ed-39629c8f2422	Headset Gamer HyperX Cloud Stinger Core Wireless, Drivers 40mm, Preto, 4P4F0AA	430.07	12	Lorem ipsum dolor sit amet consectetur adipisicing elit. Quae iusto consequuntur, harum aspernatur odit deserunt incidunt at, quibusdam ipsa id, accusantium alias ab minus ad ratione eaque quisquam suscipit labore debitis veritatis? Non expedita exercitationem totam reiciendis alias eligendi, quas libero placeat voluptate consequatur laboriosam atque amet sequi ipsam, qui quae hic, laborum recusandae sed quo accusantium deleniti ab? Qui, quod! Quod quisquam repellendus nam iure, autem quas vel blanditiis. Similique provident molestiae odio libero. Aperiam perspiciatis vero ea similique illum ducimus sapiente debitis fugit fugiat, necessitatibus recusandae repellat, obcaecati porro quidem aliquam commodi iste, temporibus ratione ipsum? Doloribus ipsum,	51	HEADSET-124	d8855725-6ad9-4a69-8293-da054fa2e9cd	2025-07-27 19:51:13.632	2025-07-27 20:17:45.426
0349825f-e0c8-49b3-a914-7df8fc2cfca1	Mouse Gamer Redragon Rind, RGB, 16000DPI, 10 Botoes, Preto	199.99	24	Lorem ipsum dolor sit amet consectetur adipisicing elit. Quae iusto consequuntur, harum aspernatur odit deserunt incidunt at, quibusdam ipsa id, accusantium alias ab minus ad ratione eaque quisquam suscipit labore debitis veritatis? Non expedita exercitationem totam reiciendis alias eligendi, quas libero placeat voluptate consequatur laboriosam atque amet sequi ipsam, qui quae hic, laborum recusandae sed quo accusantium deleniti ab? Qui, quod! Quod quisquam repellendus nam iure, autem quas vel blanditiis. Similique provident molestiae odio libero. Aperiam perspiciatis vero ea similique illum ducimus sapiente debitis fugit fugiat, necessitatibus recusandae repellat, obcaecati porro quidem aliquam commodi iste, temporibus ratione ipsum? Doloribus ipsum,	999	MOU-998	13a36e2e-cb21-41f6-84e0-f53112906ac4	2025-07-21 00:57:47.989	2025-07-27 20:17:45.426
db2e6ad0-a52e-4cd2-b7d1-82eab4562226	Teclado Mecanico Redragon Ratri, RGB, Switch Marrom, Preto, K595RGB-PT-BROWN	297.99	12	Lorem ipsum dolor sit amet consectetur adipisicing elit. Quae iusto consequuntur, harum aspernatur odit deserunt incidunt at, quibusdam ipsa id, accusantium alias ab minus ad ratione eaque quisquam suscipit labore debitis veritatis? Non expedita exercitationem totam reiciendis alias eligendi, quas libero placeat voluptate consequatur laboriosam atque amet sequi ipsam, qui quae hic, laborum recusandae sed quo accusantium deleniti ab? Qui, quod! Quod quisquam repellendus nam iure, autem quas vel blanditiis. Similique provident molestiae odio libero. Aperiam perspiciatis vero ea similique illum ducimus sapiente debitis fugit fugiat, necessitatibus recusandae repellat, obcaecati porro quidem aliquam commodi iste, temporibus ratione ipsum? Doloribus ipsum,	971	TECLADO-1251	8bee5522-3be3-4957-bfe6-57025a099155	2025-07-27 19:53:50.949	2025-07-27 20:17:45.426
e1e8645e-d770-475e-94e8-0e33b89370ab	Cadeira Gamer DT3 Chrono, Cinza	2099	15	Lorem ipsum dolor sit amet consectetur adipisicing elit. Quae iusto consequuntur, harum aspernatur odit deserunt incidunt at, quibusdam ipsa id, accusantium alias ab minus ad ratione eaque quisquam suscipit labore debitis veritatis? Non expedita exercitationem totam reiciendis alias eligendi, quas libero placeat voluptate consequatur laboriosam atque amet sequi ipsam, qui quae hic, laborum recusandae sed quo accusantium deleniti ab? Qui, quod! Quod quisquam repellendus nam iure, autem quas vel blanditiis. Similique provident molestiae odio libero. Aperiam perspiciatis vero ea similique illum ducimus sapiente debitis fugit fugiat, necessitatibus recusandae repellat, obcaecati porro quidem aliquam commodi iste, temporibus ratione ipsum? Doloribus ipsum,	36	CADEI-OF-898	2c992ca6-bdfd-4006-aee3-7bb8ea97edf9	2025-07-27 19:41:39	2025-07-27 20:17:45.426
edade7ff-c310-4416-95d7-6b9edc57e19d	Monitor Samsung S3, 27 Pol, IPS, FHD, 100Hz, HDMI, LS27D300GALMZD	980.09	12	Lorem ipsum dolor sit amet consectetur adipisicing elit. Quae iusto consequuntur, harum aspernatur odit deserunt incidunt at, quibusdam ipsa id, accusantium alias ab minus ad ratione eaque quisquam suscipit labore debitis veritatis? Non expedita exercitationem totam reiciendis alias eligendi, quas libero placeat voluptate consequatur laboriosam atque amet sequi ipsam, qui quae hic, laborum recusandae sed quo accusantium deleniti ab? Qui, quod! Quod quisquam repellendus nam iure, autem quas vel blanditiis. Similique provident molestiae odio libero. Aperiam perspiciatis vero ea similique illum ducimus sapiente debitis fugit fugiat, necessitatibus recusandae repellat, obcaecati porro quidem aliquam commodi iste, temporibus ratione ipsum? Doloribus ipsum,	36	MONITOR-12412	19a22e17-cd39-472f-814c-0b5f9e0779cf	2025-07-27 19:52:13.753	2025-07-27 20:17:45.426
fe24da23-455a-4b9e-8686-200242fbbad0	PC Gamer Pichau Quen├║bis VII, AMD Ryzen 5 5600XT, GeForce RTX 5070 Ti 16GB, 32GB DDR4, SSD M.2 1TB	17021.21	67	Lorem ipsum dolor sit amet consectetur adipisicing elit. Quae iusto consequuntur, harum aspernatur odit deserunt incidunt at, quibusdam ipsa id, accusantium alias ab minus ad ratione eaque quisquam suscipit labore debitis veritatis? Non expedita exercitationem totam reiciendis alias eligendi, quas libero placeat voluptate consequatur laboriosam atque amet sequi ipsam, qui quae hic, laborum recusandae sed quo accusantium deleniti ab? Qui, quod! Quod quisquam repellendus nam iure, autem quas vel blanditiis. Similique provident molestiae odio libero. Aperiam perspiciatis vero ea similique illum ducimus sapiente debitis fugit fugiat, necessitatibus recusandae repellat, obcaecati porro quidem aliquam commodi iste, temporibus ratione ipsum? Doloribus ipsum,	6	PC-GAMER-212	c8441818-82c6-4ef3-a141-4cff316b6725	2025-07-27 19:45:28.94	2025-07-27 20:17:45.426
\.


--
-- Data for Name: ProductAttribute; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."ProductAttribute" (attribute_id, name, unit, type) FROM stdin;
\.


--
-- Data for Name: ProductAttributeValue; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."ProductAttributeValue" (value_id, product_id, attribute_id, value) FROM stdin;
\.


--
-- Data for Name: ProductImage; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."ProductImage" (image_id, product_id, url, "primary") FROM stdin;
3cea207f-8d26-4707-9b12-61c2cc2ac3d6	2ce1a6bc-afb6-4403-bafc-6dd285f868be	https://d1bbbbpdvc.ufs.sh/f/LGdFo64y06eK8wwGrMxnd7VaH6qxvOr5LTYu2ye3lQWkUsiR	t
2361259d-d488-4317-98d1-b21a663bfa7f	2ce1a6bc-afb6-4403-bafc-6dd285f868be	https://d1bbbbpdvc.ufs.sh/f/LGdFo64y06eKOUZSmlsEwGyXhQuNAkJ5RD19qaV6tT3Wvxl8	f
e6d9473a-4a2a-4311-9de9-741ec73fe977	2ce1a6bc-afb6-4403-bafc-6dd285f868be	https://d1bbbbpdvc.ufs.sh/f/LGdFo64y06eKwtCc51fMyunj2dal4LVvbc9tK8kX6ZHA0Fhp	f
590ea659-d4c8-477d-a459-0dd285d7110f	2ce1a6bc-afb6-4403-bafc-6dd285f868be	https://d1bbbbpdvc.ufs.sh/f/LGdFo64y06eKKMseDCP3p9F07HkTrCS1jNeURwliIsZfyPaz	f
b2c9e85e-368a-47de-ab6c-4b4c9859b89c	453d0fb6-8ba7-4117-8318-030068822fbe	https://d1bbbbpdvc.ufs.sh/f/LGdFo64y06eK1H8e57XLuioqKHT6YXh9aJgDZlVLSBf2RxsC	t
43dd22a6-6877-484e-965a-a9f42ac36292	453d0fb6-8ba7-4117-8318-030068822fbe	https://d1bbbbpdvc.ufs.sh/f/LGdFo64y06eKN2SwiuoBgdEy2o4Uk9XOPHcevKCihJsRQlF5	f
ca06558d-aef8-44e9-9645-e57333f55577	453d0fb6-8ba7-4117-8318-030068822fbe	https://d1bbbbpdvc.ufs.sh/f/LGdFo64y06eKh46n4fO30BDsRF2EOqvzyd1T5WQlKnHaLJXN	f
e7e32144-5202-4304-adc0-9677af71adaa	453d0fb6-8ba7-4117-8318-030068822fbe	https://d1bbbbpdvc.ufs.sh/f/LGdFo64y06eKVFDhb1IE4Ogj3PAoyFuWt9DkrR2sBXm51eLc	f
d8410b4e-1410-4ba7-bec6-4c75db9748e8	64067de4-62c6-40a8-9634-72f425968e25	https://d1bbbbpdvc.ufs.sh/f/LGdFo64y06eKup9zNJm96piZEevPQ5xBrTDlOW0ML4KYfd7c	t
24cb4390-d8b2-4800-8f68-ad2a38690a12	0349825f-e0c8-49b3-a914-7df8fc2cfca1	https://d1bbbbpdvc.ufs.sh/f/LGdFo64y06eKGP7dHRknJg8Kvx5sAR9O176LuISDUinom2dW	t
758e6df6-368c-4f8c-ada0-e3062d025ceb	0349825f-e0c8-49b3-a914-7df8fc2cfca1	https://d1bbbbpdvc.ufs.sh/f/LGdFo64y06eK20COsGbdqhVtIQYB4rcOeDu1HLJo0xm5Gl68	f
aa3f9e24-58e7-4d2b-90ce-c4d10d1eed6f	0349825f-e0c8-49b3-a914-7df8fc2cfca1	https://d1bbbbpdvc.ufs.sh/f/LGdFo64y06eKW81awsNYcJ9ofmFaRLwnB2ZV1yrCM4Kthkpq	f
ce1d093f-937a-4a6b-8c75-71daabedb3af	0349825f-e0c8-49b3-a914-7df8fc2cfca1	https://d1bbbbpdvc.ufs.sh/f/LGdFo64y06eKYfmzRn4xuiH3TnvLbX5SGKEIy4VJlBeksFZq	f
24e3f30e-d087-46e4-a0d8-e706851e1d6a	0c9089b6-5705-4c1f-9cb6-56476b790901	https://d1bbbbpdvc.ufs.sh/f/LGdFo64y06eK8a4N3LTxnd7VaH6qxvOr5LTYu2ye3lQWkUsi	t
14d1ff12-0e66-40ff-bda9-52cfb880540c	0c9089b6-5705-4c1f-9cb6-56476b790901	https://d1bbbbpdvc.ufs.sh/f/LGdFo64y06eKS6W1h44jh6JRDKn8alcSPVYzAveiqHUTyGOs	f
07639475-f2a6-43e6-bc4c-d46ad42cab29	0c9089b6-5705-4c1f-9cb6-56476b790901	https://d1bbbbpdvc.ufs.sh/f/LGdFo64y06eKWXECdwNYcJ9ofmFaRLwnB2ZV1yrCM4Kthkpq	f
01f70e37-e43e-4e41-b4dc-81312121fd36	0c9089b6-5705-4c1f-9cb6-56476b790901	https://d1bbbbpdvc.ufs.sh/f/LGdFo64y06eKnIixsOKngbSDJyhkBLaNPQRocrsMve4dZfCl	f
1fc9cc36-dd2e-4f1a-b9bd-45ce7a0f61f7	059b30ec-ddc8-4cb2-a752-3f1ad4419541	https://utfs.io/f/LGdFo64y06eK8auIbCXxnd7VaH6qxvOr5LTYu2ye3lQWkUsi	f
cf8fdf03-f2f5-49c0-b7e3-7a3b3e459ffe	1526a09d-7477-400f-895f-e593de78e551	https://utfs.io/f/LGdFo64y06eKhWznnJNO30BDsRF2EOqvzyd1T5WQlKnHaLJX	f
aee23e35-02f5-4f39-b699-2756453fb12e	205d1607-155a-4140-9434-cce519bbd934	https://utfs.io/f/LGdFo64y06eKRkzrfVEbE8CHzkNac3gGq6T5WfFeMoOPL02Q	f
146484bf-541a-4928-9b18-6e2ec7dffff1	27dafb00-2e08-417d-97fa-4548e0a4a0e9	https://utfs.io/f/LGdFo64y06eKKeaznb4P3p9F07HkTrCS1jNeURwliIsZfyPa	f
fb1b9308-477e-4cd7-9db5-417737ecd062	2808ca15-b08c-4376-9dc0-585a204040a2	https://utfs.io/f/LGdFo64y06eK8agczsYxnd7VaH6qxvOr5LTYu2ye3lQWkUsi	f
c43a845b-912c-421a-b873-b914857ddbda	5b43d682-2acb-4e86-bfbf-c3e6b25e8395	https://d1bbbbpdvc.ufs.sh/f/LGdFo64y06eKUqAWQbeehGv364yiwBT0rm9KXY215flzD8WI	f
a7a2ea07-c42c-439d-962d-b225783c6a12	91be7320-3120-46af-b707-cfb4f8672fcd	https://d1bbbbpdvc.ufs.sh/f/LGdFo64y06eK4WzKIPAVbRc4TiZqOolFs9Ap5P0ngNQuI8MU	f
cfe92d74-f5c7-414c-80a6-b4fd4edca5c1	a0800e10-205e-48c7-bc1f-42013cdf2a5c	https://d1bbbbpdvc.ufs.sh/f/LGdFo64y06eKVu3xn6cIE4Ogj3PAoyFuWt9DkrR2sBXm51eL	f
21afef6a-61ab-4728-a1f1-6a30bc483022	b076aa00-84af-46c3-97c7-bbd6e55ace59	https://d1bbbbpdvc.ufs.sh/f/LGdFo64y06eKw1ydApbfMyunj2dal4LVvbc9tK8kX6ZHA0Fh	f
128e7fae-7ae6-4eb8-90e0-76ae40cada31	cf8a90fc-9d74-4fbe-a3ed-39629c8f2422	https://d1bbbbpdvc.ufs.sh/f/LGdFo64y06eKXHHwhAuBYs0iuOhTrm7Qc41RMfgaC86FNpyU	f
1a162301-9769-46b5-b1dd-c10c99714e9a	db2e6ad0-a52e-4cd2-b7d1-82eab4562226	https://d1bbbbpdvc.ufs.sh/f/LGdFo64y06eKACQiN8V56kFBuscyZzQpOUodKEhnG04qXN7T	f
e4ef08e8-7ba5-44ac-aca4-92274a2d9710	e1e8645e-d770-475e-94e8-0e33b89370ab	https://d1bbbbpdvc.ufs.sh/f/LGdFo64y06eKbqcFK7JFZwGQ6IsB9ge7mhXlDSYMpUyJ5VRK	f
bf9fd231-d680-44bf-be2a-4e75b13bc32b	edade7ff-c310-4416-95d7-6b9edc57e19d	https://d1bbbbpdvc.ufs.sh/f/LGdFo64y06eKmbITRCgpW2GgAOUXHdoB4P63Cmf18DMtiyIa	f
f47a877a-c6e8-4811-89f6-12479a253e73	aed59157-6c9c-45cc-a6e0-497f1b85e6d2	https://d1bbbbpdvc.ufs.sh/f/LGdFo64y06eKyYoaxHR4gTH5GO1XSIDoeNPjA9kflu68UYcQ	f
f11d3eeb-f562-40a5-bbd5-95033c52d36b	fe24da23-455a-4b9e-8686-200242fbbad0	https://d1bbbbpdvc.ufs.sh/f/LGdFo64y06eKhWzQJXhO30BDsRF2EOqvzyd1T5WQlKnHaLJX	f
aada3b7e-1fe1-449d-b3f3-f6e8991c709e	11e9de64-8e58-45d9-a58f-9200eee83f71	https://d1bbbbpdvc.ufs.sh/f/LGdFo64y06eKqAbPVOQyEMfu7KF51olcLvixgrSeQO4PYZTq	f
\.


--
-- Data for Name: RefreshToken; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."RefreshToken" (id, user_id, token, created_at, expires_at) FROM stdin;
f55744e0-d5ee-4c6f-8a04-0a27c052d494	ec7d7252-c235-45c5-b702-6ff8ec749b0c	eyJhbGciOiJIUzUxMiJ9.eyJ1c2VyX2lkIjoiZWM3ZDcyNTItYzIzNS00NWM1LWI3MDItNmZmOGVjNzQ5YjBjIiwiZW1haWwiOiJsZW9uYXJkby5hbHZhcmVuZ2FAZ21haWwuY29tIiwicm9sZSI6IkFETUlOIiwiaWF0IjoxNzUzNzI0NDkxLCJleHAiOjE3NTQzMjkyOTF9.G-FEESvOeynW3MJMNYy-aKoj92dtMT2LiDaZL-UnXwuQfiIQelxn7jgGpITcQ4syNzSSy4TAM9gz0ztjQl__jg	2025-07-28 17:41:31.125	2025-08-04 17:41:31.123
\.


--
-- Data for Name: Review; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Review" (id, user_id, product_id, rating, comment, created_at) FROM stdin;
\.


--
-- Data for Name: ShippingMethod; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."ShippingMethod" (id, name, price, estimated_days) FROM stdin;
\.


--
-- Data for Name: User; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."User" (user_id, email, name, password, phone, role, created_at, updated_at) FROM stdin;
ec7d7252-c235-45c5-b702-6ff8ec749b0c	leonardo.alvarenga@gmail.com	Leonardo Prado	$2b$12$67hnFWIO7rVA8lzu.J0iM.z6LYJBblF4GjQsQMEprVK/soUpVkW.i	11950655398	ADMIN	2025-07-20 22:48:36.749	2025-07-27 15:28:47.159
3e2ac305-07d6-4801-9bd7-f50f0c083db2	teste@teste.com	Teste da Silva	$2b$12$vOFNgob46/7NyaBfUSOSreerNQFBmWvsGjBzgzyPAp.VV5W8liQXC	\N	CUSTOMER	2025-07-27 20:19:02.73	2025-07-27 20:19:02.73
\.


--
-- Data for Name: UserAddress; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."UserAddress" (address_id, user_id, street, number, city, state, zip_code, complement) FROM stdin;
\.


--
-- Data for Name: Wishlist; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Wishlist" (id, user_id, created_at, updated_at) FROM stdin;
215ef494-9936-41a4-bd66-865154f8087e	ec7d7252-c235-45c5-b702-6ff8ec749b0c	2025-07-20 22:48:36.775	2025-07-20 22:48:36.775
8dc7a1da-e177-49e5-95d1-ca7ed44bf60a	3e2ac305-07d6-4801-9bd7-f50f0c083db2	2025-07-27 20:19:02.798	2025-07-27 20:19:02.798
\.


--
-- Data for Name: WishlistItem; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."WishlistItem" (id, wishlist_id, product_id) FROM stdin;
\.


--
-- Data for Name: _prisma_migrations; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public._prisma_migrations (id, checksum, finished_at, migration_name, logs, rolled_back_at, started_at, applied_steps_count) FROM stdin;
0abda8f9-aa38-4453-8aed-915f7a93ec57	94bd3d8bd79ad3626913d0167c191a71465caad775f5ede5a29779d46a47e7bb	2025-07-22 18:11:00.102569+00	20250722181059_add_category_image	\N	\N	2025-07-22 18:10:59.995692+00	1
e26654b1-03a8-4df0-b244-aa9527f25701	12ffdebadc429d323546e1b7cbcec89d1a8e838d29a8d32f7d899dcf0cef7077	2025-07-20 22:30:02.524136+00	20250709171001_init	\N	\N	2025-07-20 22:30:02.45084+00	1
1ea73e9c-92ae-46ac-a9c3-c5047c81c04d	0266728b5243c8595843fb84c72c76da53e82210dc654bdc9bcfeafd7e6c0fb3	2025-07-20 22:30:02.530019+00	20250709212737_add_paid_in_order_status	\N	\N	2025-07-20 22:30:02.525808+00	1
451d3601-e422-43dc-ace5-844bfc37fa51	adbe764c2e377bcad55d7e77f14f02889163ae83e06837af357b96bb1e07b9da	2025-07-20 22:30:02.536195+00	20250709213539_add_failed_in_order_status	\N	\N	2025-07-20 22:30:02.53177+00	1
f0190bd1-d0f3-4ce4-bf06-ff1d4896e58f	971a4893419117eb4102b357b541d30a7bb49fbdb2bc5c424f85ced41747dc51	2025-07-20 22:30:02.547959+00	20250709214002_add_stripe_in_order	\N	\N	2025-07-20 22:30:02.538659+00	1
40e80d7c-201e-4454-9288-b48e6aec6409	af0d3599c07976a70dd21ff3f9b57b549ccc53a2d6cd3c0894a10c27f81a41e8	2025-07-20 22:30:02.572868+00	20250712230944_add	\N	\N	2025-07-20 22:30:02.549647+00	1
250cf0c0-31e4-4a6c-aada-43869b62725f	ec6783272e393191c6e85dfec27fb66b1e0e4eb2b622bac230aa8918a54d12ce	2025-07-20 22:30:02.611633+00	20250716185059_product_descount	\N	\N	2025-07-20 22:30:02.575148+00	1
fe6104a4-9ec0-4f39-9611-a745eab924ee	88d2bbba4eff64ae8765cd7d6e3054b0f4b36a1eed2c875533f8e026048c433b	2025-07-20 22:30:02.618155+00	20250719151828_update_user_address	\N	\N	2025-07-20 22:30:02.613257+00	1
d893dffa-95ea-444b-8864-c83523b87eb4	b0a46712ab2add907a864408c51270db7835a82be0f86e7a00035da002534876	2025-07-20 22:30:02.625663+00	20250720175626_altera_nome	\N	\N	2025-07-20 22:30:02.620672+00	1
b3f46aa8-d0de-44e8-9d26-f755bcc367b0	d57bfe2f4fd357d136873953be53ac9c3c75ad9e69ebe992ae3ad51b3e47165f	2025-07-20 22:44:42.066551+00	20250720224442_adiciona_url_payment	\N	\N	2025-07-20 22:44:42.056857+00	1
\.


--
-- Name: Banners Banners_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Banners"
    ADD CONSTRAINT "Banners_pkey" PRIMARY KEY (id);


--
-- Name: CartItem CartItem_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."CartItem"
    ADD CONSTRAINT "CartItem_pkey" PRIMARY KEY (cart_item_id);


--
-- Name: Cart Cart_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Cart"
    ADD CONSTRAINT "Cart_pkey" PRIMARY KEY (cart_id);


--
-- Name: CategoryAttribute CategoryAttribute_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."CategoryAttribute"
    ADD CONSTRAINT "CategoryAttribute_pkey" PRIMARY KEY (id);


--
-- Name: Category Category_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Category"
    ADD CONSTRAINT "Category_pkey" PRIMARY KEY (category_id);


--
-- Name: Coupon Coupon_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Coupon"
    ADD CONSTRAINT "Coupon_pkey" PRIMARY KEY (code);


--
-- Name: OrderItem OrderItem_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."OrderItem"
    ADD CONSTRAINT "OrderItem_pkey" PRIMARY KEY (order_item_id);


--
-- Name: Order Order_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Order"
    ADD CONSTRAINT "Order_pkey" PRIMARY KEY (order_id);


--
-- Name: ProductAttributeValue ProductAttributeValue_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."ProductAttributeValue"
    ADD CONSTRAINT "ProductAttributeValue_pkey" PRIMARY KEY (value_id);


--
-- Name: ProductAttribute ProductAttribute_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."ProductAttribute"
    ADD CONSTRAINT "ProductAttribute_pkey" PRIMARY KEY (attribute_id);


--
-- Name: ProductImage ProductImage_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."ProductImage"
    ADD CONSTRAINT "ProductImage_pkey" PRIMARY KEY (image_id);


--
-- Name: Product Product_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Product"
    ADD CONSTRAINT "Product_pkey" PRIMARY KEY (product_id);


--
-- Name: RefreshToken RefreshToken_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."RefreshToken"
    ADD CONSTRAINT "RefreshToken_pkey" PRIMARY KEY (id);


--
-- Name: Review Review_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Review"
    ADD CONSTRAINT "Review_pkey" PRIMARY KEY (id);


--
-- Name: ShippingMethod ShippingMethod_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."ShippingMethod"
    ADD CONSTRAINT "ShippingMethod_pkey" PRIMARY KEY (id);


--
-- Name: UserAddress UserAddress_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."UserAddress"
    ADD CONSTRAINT "UserAddress_pkey" PRIMARY KEY (address_id);


--
-- Name: User User_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_pkey" PRIMARY KEY (user_id);


--
-- Name: WishlistItem WishlistItem_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."WishlistItem"
    ADD CONSTRAINT "WishlistItem_pkey" PRIMARY KEY (id);


--
-- Name: Wishlist Wishlist_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Wishlist"
    ADD CONSTRAINT "Wishlist_pkey" PRIMARY KEY (id);


--
-- Name: _prisma_migrations _prisma_migrations_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public._prisma_migrations
    ADD CONSTRAINT _prisma_migrations_pkey PRIMARY KEY (id);


--
-- Name: Banners_title_image_url_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "Banners_title_image_url_key" ON public."Banners" USING btree (title, image_url);


--
-- Name: Cart_user_id_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "Cart_user_id_key" ON public."Cart" USING btree (user_id);


--
-- Name: CategoryAttribute_category_id_attribute_id_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "CategoryAttribute_category_id_attribute_id_key" ON public."CategoryAttribute" USING btree (category_id, attribute_id);


--
-- Name: Category_name_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "Category_name_key" ON public."Category" USING btree (name);


--
-- Name: Order_stripe_payment_intent_id_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "Order_stripe_payment_intent_id_key" ON public."Order" USING btree (stripe_payment_intent_id);


--
-- Name: Order_stripe_session_id_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "Order_stripe_session_id_key" ON public."Order" USING btree (stripe_session_id);


--
-- Name: Order_url_payment_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "Order_url_payment_key" ON public."Order" USING btree (url_payment);


--
-- Name: ProductAttributeValue_product_id_attribute_id_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "ProductAttributeValue_product_id_attribute_id_key" ON public."ProductAttributeValue" USING btree (product_id, attribute_id);


--
-- Name: ProductImage_product_id_url_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "ProductImage_product_id_url_key" ON public."ProductImage" USING btree (product_id, url);


--
-- Name: Product_sku_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "Product_sku_key" ON public."Product" USING btree (sku);


--
-- Name: RefreshToken_token_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "RefreshToken_token_key" ON public."RefreshToken" USING btree (token);


--
-- Name: Review_user_id_product_id_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "Review_user_id_product_id_key" ON public."Review" USING btree (user_id, product_id);


--
-- Name: UserAddress_user_id_street_city_state_zip_code_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "UserAddress_user_id_street_city_state_zip_code_key" ON public."UserAddress" USING btree (user_id, street, city, state, zip_code);


--
-- Name: User_email_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "User_email_key" ON public."User" USING btree (email);


--
-- Name: WishlistItem_wishlist_id_product_id_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "WishlistItem_wishlist_id_product_id_key" ON public."WishlistItem" USING btree (wishlist_id, product_id);


--
-- Name: Wishlist_user_id_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "Wishlist_user_id_key" ON public."Wishlist" USING btree (user_id);


--
-- Name: CartItem CartItem_cart_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."CartItem"
    ADD CONSTRAINT "CartItem_cart_id_fkey" FOREIGN KEY (cart_id) REFERENCES public."Cart"(cart_id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: CartItem CartItem_product_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."CartItem"
    ADD CONSTRAINT "CartItem_product_id_fkey" FOREIGN KEY (product_id) REFERENCES public."Product"(product_id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Cart Cart_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Cart"
    ADD CONSTRAINT "Cart_user_id_fkey" FOREIGN KEY (user_id) REFERENCES public."User"(user_id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: CategoryAttribute CategoryAttribute_attribute_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."CategoryAttribute"
    ADD CONSTRAINT "CategoryAttribute_attribute_id_fkey" FOREIGN KEY (attribute_id) REFERENCES public."ProductAttribute"(attribute_id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: CategoryAttribute CategoryAttribute_category_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."CategoryAttribute"
    ADD CONSTRAINT "CategoryAttribute_category_id_fkey" FOREIGN KEY (category_id) REFERENCES public."Category"(category_id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: OrderItem OrderItem_order_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."OrderItem"
    ADD CONSTRAINT "OrderItem_order_id_fkey" FOREIGN KEY (order_id) REFERENCES public."Order"(order_id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: OrderItem OrderItem_product_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."OrderItem"
    ADD CONSTRAINT "OrderItem_product_id_fkey" FOREIGN KEY (product_id) REFERENCES public."Product"(product_id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Order Order_couponCode_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Order"
    ADD CONSTRAINT "Order_couponCode_fkey" FOREIGN KEY ("couponCode") REFERENCES public."Coupon"(code) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: Order Order_shippingMethodId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Order"
    ADD CONSTRAINT "Order_shippingMethodId_fkey" FOREIGN KEY ("shippingMethodId") REFERENCES public."ShippingMethod"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: Order Order_shipping_address_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Order"
    ADD CONSTRAINT "Order_shipping_address_id_fkey" FOREIGN KEY (shipping_address_id) REFERENCES public."UserAddress"(address_id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: Order Order_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Order"
    ADD CONSTRAINT "Order_user_id_fkey" FOREIGN KEY (user_id) REFERENCES public."User"(user_id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: ProductAttributeValue ProductAttributeValue_attribute_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."ProductAttributeValue"
    ADD CONSTRAINT "ProductAttributeValue_attribute_id_fkey" FOREIGN KEY (attribute_id) REFERENCES public."ProductAttribute"(attribute_id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: ProductAttributeValue ProductAttributeValue_product_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."ProductAttributeValue"
    ADD CONSTRAINT "ProductAttributeValue_product_id_fkey" FOREIGN KEY (product_id) REFERENCES public."Product"(product_id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: ProductImage ProductImage_product_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."ProductImage"
    ADD CONSTRAINT "ProductImage_product_id_fkey" FOREIGN KEY (product_id) REFERENCES public."Product"(product_id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Product Product_category_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Product"
    ADD CONSTRAINT "Product_category_id_fkey" FOREIGN KEY (category_id) REFERENCES public."Category"(category_id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: RefreshToken RefreshToken_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."RefreshToken"
    ADD CONSTRAINT "RefreshToken_user_id_fkey" FOREIGN KEY (user_id) REFERENCES public."User"(user_id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Review Review_product_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Review"
    ADD CONSTRAINT "Review_product_id_fkey" FOREIGN KEY (product_id) REFERENCES public."Product"(product_id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Review Review_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Review"
    ADD CONSTRAINT "Review_user_id_fkey" FOREIGN KEY (user_id) REFERENCES public."User"(user_id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: UserAddress UserAddress_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."UserAddress"
    ADD CONSTRAINT "UserAddress_user_id_fkey" FOREIGN KEY (user_id) REFERENCES public."User"(user_id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: WishlistItem WishlistItem_product_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."WishlistItem"
    ADD CONSTRAINT "WishlistItem_product_id_fkey" FOREIGN KEY (product_id) REFERENCES public."Product"(product_id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: WishlistItem WishlistItem_wishlist_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."WishlistItem"
    ADD CONSTRAINT "WishlistItem_wishlist_id_fkey" FOREIGN KEY (wishlist_id) REFERENCES public."Wishlist"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Wishlist Wishlist_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Wishlist"
    ADD CONSTRAINT "Wishlist_user_id_fkey" FOREIGN KEY (user_id) REFERENCES public."User"(user_id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: SCHEMA public; Type: ACL; Schema: -; Owner: postgres
--

REVOKE USAGE ON SCHEMA public FROM PUBLIC;


--
-- PostgreSQL database dump complete
--

