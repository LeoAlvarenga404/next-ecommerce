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
    name text NOT NULL
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
-- Data for Name: Cart; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Cart" (cart_id, user_id, created_at, updated_at) FROM stdin;
50955a5a-4922-4569-a779-b4de38d79170	ec7d7252-c235-45c5-b702-6ff8ec749b0c	2025-07-21 00:50:00.524	2025-07-21 00:50:00.524
\.


--
-- Data for Name: CartItem; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."CartItem" (cart_item_id, cart_id, product_id, quantity) FROM stdin;
\.


--
-- Data for Name: Category; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Category" (category_id, name) FROM stdin;
13a36e2e-cb21-41f6-84e0-f53112906ac4	Mouse
1df71864-d9da-4ca5-8658-48161325203a	Mousepad
c8441818-82c6-4ef3-a141-4cff316b6725	Computador
9c1f1c46-0be8-4e3b-888e-b889d5ad6f05	Placa de V├¡deo
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
70462b86-5307-485e-960b-50d84e130409	ec7d7252-c235-45c5-b702-6ff8ec749b0c	151.9924	PAID	06e36c3d-7f04-453f-b109-0cff89d6a5c2	\N	cs_test_a1GOYu81dqdfP4VhIjYFJDTFsCDlQL7qBw3HH4Ih9UjPWkVlzHZ3kq1Hma	pi_3RnOJmFlLDpWmu381yaQ2b9Q	https://checkout.stripe.com/c/pay/cs_test_a1GOYu81dqdfP4VhIjYFJDTFsCDlQL7qBw3HH4Ih9UjPWkVlzHZ3kq1Hma#fidkdWxOYHwnPyd1blpxYHZxWjA0V28xfXVDaUlBdVJocDY9dWxiYzNIcmF2MWk1TkBtQkw3QnZzYWxKSUJCMUxWUEFrQlZ9Y09KQXddcm9PdjBrU3xNZGpvT0NAN0lGZkN3TEdMaG1SNlZGNTVKQG1KRk9yTycpJ2N3amhWYHdzYHcnP3F3cGApJ2lkfGpwcVF8dWAnPyd2bGtiaWBabHFgaCcpJ2BrZGdpYFVpZGZgbWppYWB3dic%2FcXdwYHgl	2025-07-21 18:20:00.113	2025-07-21 18:20:11.166	\N	\N
1bb2eead-92cf-44cf-9922-ce60fcfcfcf9	ec7d7252-c235-45c5-b702-6ff8ec749b0c	29999.05	PAID	06e36c3d-7f04-453f-b109-0cff89d6a5c2	\N	cs_test_a19TzTXmf3xFzeqx0uB5w0UwUOm9PlIkacIrUpMxDO7i2tDDq1t9epcrjy	pi_3RnOMXFlLDpWmu381kUDGwAZ	https://checkout.stripe.com/c/pay/cs_test_a19TzTXmf3xFzeqx0uB5w0UwUOm9PlIkacIrUpMxDO7i2tDDq1t9epcrjy#fidkdWxOYHwnPyd1blpxYHZxWjA0V28xfXVDaUlBdVJocDY9dWxiYzNIcmF2MWk1TkBtQkw3QnZzYWxKSUJCMUxWUEFrQlZ9Y09KQXddcm9PdjBrU3xNZGpvT0NAN0lGZkN3TEdMaG1SNlZGNTVKQG1KRk9yTycpJ2N3amhWYHdzYHcnP3F3cGApJ2lkfGpwcVF8dWAnPyd2bGtiaWBabHFgaCcpJ2BrZGdpYFVpZGZgbWppYWB3dic%2FcXdwYHgl	2025-07-21 18:22:53.466	2025-07-21 18:23:01.525	\N	\N
9ee4126c-1f67-49cc-978c-6676ed5ca3b5	ec7d7252-c235-45c5-b702-6ff8ec749b0c	1819.993	PAID	06e36c3d-7f04-453f-b109-0cff89d6a5c2	\N	cs_test_a1Npe2n4w48FwmHhgolhni34QHZxoB2VzhgeKZ0pMTNgs1BK6ovdgPkd3Q	pi_3RnOP3FlLDpWmu380kR5qP39	https://checkout.stripe.com/c/pay/cs_test_a1Npe2n4w48FwmHhgolhni34QHZxoB2VzhgeKZ0pMTNgs1BK6ovdgPkd3Q#fidkdWxOYHwnPyd1blpxYHZxWjA0V28xfXVDaUlBdVJocDY9dWxiYzNIcmF2MWk1TkBtQkw3QnZzYWxKSUJCMUxWUEFrQlZ9Y09KQXddcm9PdjBrU3xNZGpvT0NAN0lGZkN3TEdMaG1SNlZGNTVKQG1KRk9yTycpJ2N3amhWYHdzYHcnP3F3cGApJ2lkfGpwcVF8dWAnPyd2bGtiaWBabHFgaCcpJ2BrZGdpYFVpZGZgbWppYWB3dic%2FcXdwYHgl	2025-07-21 18:25:26.846	2025-07-21 18:25:37.597	\N	\N
bc2b2204-2242-418d-94df-a0cbcd2f8a94	ec7d7252-c235-45c5-b702-6ff8ec749b0c	229.4	PAID	06e36c3d-7f04-453f-b109-0cff89d6a5c2	\N	cs_test_a1TAn0ZxgrwkTNw5Ho3QYlucKKb8LeynyODhjZrQpc0WvHVV1xR5Y8vSxu	pi_3RnOYuFlLDpWmu381m6yhuTc	https://checkout.stripe.com/c/pay/cs_test_a1TAn0ZxgrwkTNw5Ho3QYlucKKb8LeynyODhjZrQpc0WvHVV1xR5Y8vSxu#fidkdWxOYHwnPyd1blpxYHZxWjA0V28xfXVDaUlBdVJocDY9dWxiYzNIcmF2MWk1TkBtQkw3QnZzYWxKSUJCMUxWUEFrQlZ9Y09KQXddcm9PdjBrU3xNZGpvT0NAN0lGZkN3TEdMaG1SNlZGNTVKQG1KRk9yTycpJ2N3amhWYHdzYHcnP3F3cGApJ2lkfGpwcVF8dWAnPyd2bGtiaWBabHFgaCcpJ2BrZGdpYFVpZGZgbWppYWB3dic%2FcXdwYHgl	2025-07-21 18:35:37.563	2025-07-21 18:35:49.032	\N	\N
89f268fe-547f-4371-96a6-9c20e0ba20c4	ec7d7252-c235-45c5-b702-6ff8ec749b0c	1180.223	PAID	06e36c3d-7f04-453f-b109-0cff89d6a5c2	\N	cs_test_b1HMI2P3pDV02sSRPxi6r3Oxk6pYvXzttH73fPK0Re4uKOFTJS2iR7ivdF	pi_3RnOdoFlLDpWmu380TibSbXW	https://checkout.stripe.com/c/pay/cs_test_b1HMI2P3pDV02sSRPxi6r3Oxk6pYvXzttH73fPK0Re4uKOFTJS2iR7ivdF#fidkdWxOYHwnPyd1blpxYHZxWjA0V28xfXVDaUlBdVJocDY9dWxiYzNIcmF2MWk1TkBtQkw3QnZzYWxKSUJCMUxWUEFrQlZ9Y09KQXddcm9PdjBrU3xNZGpvT0NAN0lGZkN3TEdMaG1SNlZGNTVKQG1KRk9yTycpJ2N3amhWYHdzYHcnP3F3cGApJ2lkfGpwcVF8dWAnPydocGlxbFpscWBoJyknYGtkZ2lgVWlkZmBtamlhYHd2Jz9xd3BgeCUl	2025-07-21 18:40:32.427	2025-07-21 18:40:52.988	\N	\N
2bd6a6fe-c8b6-4e99-80b9-c453b63faf16	ec7d7252-c235-45c5-b702-6ff8ec749b0c	1180.223	PAID	06e36c3d-7f04-453f-b109-0cff89d6a5c2	\N	cs_test_b1diakdRf0QN5HSrH9UJL5pTHO3oH9C88Qk2CGhdOt8mdt4FJbLj3L8bvu	pi_3RnOhJFlLDpWmu380tP3RK9k	https://checkout.stripe.com/c/pay/cs_test_b1diakdRf0QN5HSrH9UJL5pTHO3oH9C88Qk2CGhdOt8mdt4FJbLj3L8bvu#fidkdWxOYHwnPyd1blpxYHZxWjA0V28xfXVDaUlBdVJocDY9dWxiYzNIcmF2MWk1TkBtQkw3QnZzYWxKSUJCMUxWUEFrQlZ9Y09KQXddcm9PdjBrU3xNZGpvT0NAN0lGZkN3TEdMaG1SNlZGNTVKQG1KRk9yTycpJ2N3amhWYHdzYHcnP3F3cGApJ2lkfGpwcVF8dWAnPydocGlxbFpscWBoJyknYGtkZ2lgVWlkZmBtamlhYHd2Jz9xd3BgeCUl	2025-07-21 18:44:10.722	2025-07-21 18:44:29.596	\N	\N
9975f7a4-f430-4d0d-bacf-62a8e41f125b	ec7d7252-c235-45c5-b702-6ff8ec749b0c	299.9905	PAID	06e36c3d-7f04-453f-b109-0cff89d6a5c2	\N	cs_test_a1WQqsVqDhyKRLPxStSNT6VFaIdcOo940clIbq3fgA11dgIAGpb37kYvJW	pi_3RnOpfFlLDpWmu380Wz3aGLw	https://checkout.stripe.com/c/pay/cs_test_a1WQqsVqDhyKRLPxStSNT6VFaIdcOo940clIbq3fgA11dgIAGpb37kYvJW#fidkdWxOYHwnPyd1blpxYHZxWjA0V28xfXVDaUlBdVJocDY9dWxiYzNIcmF2MWk1TkBtQkw3QnZzYWxKSUJCMUxWUEFrQlZ9Y09KQXddcm9PdjBrU3xNZGpvT0NAN0lGZkN3TEdMaG1SNlZGNTVKQG1KRk9yTycpJ2N3amhWYHdzYHcnP3F3cGApJ2lkfGpwcVF8dWAnPyd2bGtiaWBabHFgaCcpJ2BrZGdpYFVpZGZgbWppYWB3dic%2FcXdwYHgl	2025-07-21 18:52:55.48	2025-07-21 18:53:07.248	\N	\N
edcf089d-5222-4b33-b454-ebe74f2c3760	ec7d7252-c235-45c5-b702-6ff8ec749b0c	299.9905	PAID	06e36c3d-7f04-453f-b109-0cff89d6a5c2	\N	cs_test_a10XJ0qgvwfbzCR5B19iVLQXni6wlilTWODclRYFXRrgeLPzkMKyJeZq34	pi_3RnOyWFlLDpWmu381DvTLoJk	https://checkout.stripe.com/c/pay/cs_test_a10XJ0qgvwfbzCR5B19iVLQXni6wlilTWODclRYFXRrgeLPzkMKyJeZq34#fidkdWxOYHwnPyd1blpxYHZxWjA0V28xfXVDaUlBdVJocDY9dWxiYzNIcmF2MWk1TkBtQkw3QnZzYWxKSUJCMUxWUEFrQlZ9Y09KQXddcm9PdjBrU3xNZGpvT0NAN0lGZkN3TEdMaG1SNlZGNTVKQG1KRk9yTycpJ2N3amhWYHdzYHcnP3F3cGApJ2lkfGpwcVF8dWAnPyd2bGtiaWBabHFgaCcpJ2BrZGdpYFVpZGZgbWppYWB3dic%2FcXdwYHgl	2025-07-21 19:02:05.843	2025-07-21 19:02:16.71	\N	\N
adb9c524-9d6c-465a-b6af-aab6a7b1c6f4	ec7d7252-c235-45c5-b702-6ff8ec749b0c	1180.223	PAID	06e36c3d-7f04-453f-b109-0cff89d6a5c2	\N	cs_test_b1RfYhHwm90VHIVI27w6rNerJS1lLsj2ZDEDj49k4MdTwoMRJ6Lr3rSSIY	pi_3RnP2PFlLDpWmu381drkt7Nc	https://checkout.stripe.com/c/pay/cs_test_b1RfYhHwm90VHIVI27w6rNerJS1lLsj2ZDEDj49k4MdTwoMRJ6Lr3rSSIY#fidkdWxOYHwnPyd1blpxYHZxWjA0V28xfXVDaUlBdVJocDY9dWxiYzNIcmF2MWk1TkBtQkw3QnZzYWxKSUJCMUxWUEFrQlZ9Y09KQXddcm9PdjBrU3xNZGpvT0NAN0lGZkN3TEdMaG1SNlZGNTVKQG1KRk9yTycpJ2N3amhWYHdzYHcnP3F3cGApJ2lkfGpwcVF8dWAnPydocGlxbFpscWBoJyknYGtkZ2lgVWlkZmBtamlhYHd2Jz9xd3BgeCUl	2025-07-21 19:06:03.943	2025-07-21 19:06:17.484	\N	\N
\.


--
-- Data for Name: OrderItem; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."OrderItem" (order_item_id, order_id, product_id, quantity, unit_price) FROM stdin;
ffd4e017-a92d-4213-833b-b61356212c6c	70462b86-5307-485e-960b-50d84e130409	0349825f-e0c8-49b3-a914-7df8fc2cfca1	1	15199.24
a87e0cb6-ffcd-4773-b59b-ae56cf309bef	1bb2eead-92cf-44cf-9922-ce60fcfcfcf9	2ce1a6bc-afb6-4403-bafc-6dd285f868be	1	29999.05
5c6b054d-bc5e-46c4-a3da-17a998b5123a	9ee4126c-1f67-49cc-978c-6676ed5ca3b5	453d0fb6-8ba7-4117-8318-030068822fbe	1	181999.3
ea10ddfc-9b42-4811-b220-31e97728db9c	bc2b2204-2242-418d-94df-a0cbcd2f8a94	64067de4-62c6-40a8-9634-72f425968e25	1	22940
83cbd684-cb99-4ec5-adbf-0eb3460c1ee3	89f268fe-547f-4371-96a6-9c20e0ba20c4	0c9089b6-5705-4c1f-9cb6-56476b790901	1	102823.06
e4918e1b-3183-4f83-a6e1-0e4368861261	89f268fe-547f-4371-96a6-9c20e0ba20c4	0349825f-e0c8-49b3-a914-7df8fc2cfca1	1	15199.24
9fc5cabc-1439-46d8-ad31-818b21fa3afb	2bd6a6fe-c8b6-4e99-80b9-c453b63faf16	0349825f-e0c8-49b3-a914-7df8fc2cfca1	1	15199.24
a7c98a28-e360-4e3c-b764-77f096cba5c1	2bd6a6fe-c8b6-4e99-80b9-c453b63faf16	0c9089b6-5705-4c1f-9cb6-56476b790901	1	102823.06
1fd83d96-d1c5-4bca-a757-3aee3ec47fd6	9975f7a4-f430-4d0d-bacf-62a8e41f125b	2ce1a6bc-afb6-4403-bafc-6dd285f868be	1	29999.05
0780c4d3-d039-41cb-bf30-1b1442277e39	edcf089d-5222-4b33-b454-ebe74f2c3760	2ce1a6bc-afb6-4403-bafc-6dd285f868be	1	29999.05
e35a7b59-9263-42cb-a9be-446de5da8fd8	adb9c524-9d6c-465a-b6af-aab6a7b1c6f4	0349825f-e0c8-49b3-a914-7df8fc2cfca1	1	151.9924
72431ca9-6755-49ab-8fd7-91761893b8ed	adb9c524-9d6c-465a-b6af-aab6a7b1c6f4	0c9089b6-5705-4c1f-9cb6-56476b790901	1	1028.2306
\.


--
-- Data for Name: Product; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Product" (product_id, name, price, discount, description, stock, sku, category_id, created_at, updated_at) FROM stdin;
64067de4-62c6-40a8-9634-72f425968e25	Mousepad Aigo DarkFlash Flex 800 RGB 800x300x4mm	229.4	0	O Mousepad Aigo Darkflash Flex 800 RGB ├® um acess├│rio indispens├ível para quem busca elevar o desempenho e o estilo do setup.  Com dimens├Áes amplas de 800x300mm e uma espessura de 4mm, ele oferece espa├ºo generoso para movimentos precisos, acomodando teclado e mouse com conforto e estabilidade.	51	MOUPAD-999	1df71864-d9da-4ca5-8658-48161325203a	2025-07-21 00:51:39.293	2025-07-21 00:51:39.293
0349825f-e0c8-49b3-a914-7df8fc2cfca1	Mouse Gamer Redragon Rind, RGB, 16000DPI, 10 Botoes, Preto	199.99	24	Mouse Gamer Redragon Rind equipado com sensor PAW3333 de alta precis├úo. Scroll com ativa├º├úo lateral e rolagem infinita para p├íginas compridas. Equipado com 10 bot├Áes program├íveis para deixar macros e atalhos na ponta dos dedos. Ilumina├º├úo RGB em volta da base do mouse trazendo mais brilho para seu setup. Formato ergon├┤mico com curvas e apoios dedicados para os dedos. Lateral esquerda texturizada para melhorar a ader├¬ncia e o contato com os dedos.	45	MOU-998	13a36e2e-cb21-41f6-84e0-f53112906ac4	2025-07-21 00:57:47.989	2025-07-21 01:00:49.949
0c9089b6-5705-4c1f-9cb6-56476b790901	Mouse Gamer Razer Deathadder V3 Pro, Wireless, 30000DPI, 5 Botoes, Preto	2705.87	62	A vit├│ria ganha um novo formato com o Razer DeathAdder V3 Pro. Reprojetado e aperfei├ºoado com a ajuda dos maiores profissionais dos esports, seu ic├┤nico formato ergon├┤mico agora ├® mais de 25% mais leve do que o do seu predecessor, contando ainda com uma s├®rie de upgrades de ponta para ampliar os limites dos jogos competitivos.	5	MOU-997	13a36e2e-cb21-41f6-84e0-f53112906ac4	2025-07-21 00:59:42.759	2025-07-21 01:00:49.949
2ce1a6bc-afb6-4403-bafc-6dd285f868be	Mouse Gamer Redragon K1ng 8K, 26000DPI, 5 Botoes, Preto	352.93	15	Desempenho extremo em um corpo ultraleve: equipado com o sensor Pixart PAW3395, este mouse gamer entrega precisÔö£├║o absoluta com atÔö£┬« 26.000 DPI, garantindo rastreamento suave e responsivo em qualquer ritmo de jogo. Tudo isso em uma estrutura sÔö£Ôöélida, pesando apenas 42g.	39	MOU-999	13a36e2e-cb21-41f6-84e0-f53112906ac4	2025-07-20 22:52:19.877	2025-07-21 01:00:49.949
453d0fb6-8ba7-4117-8318-030068822fbe	Placa de Video Gainward GeForce RTX 5060 Ghost, 8GB, GDDR7, 128-bit	2599.99	30	A RTX 5060 Ghost da Gainward oferece uma combina├º├úo de desempenho moderno e visual discreto. Com 8GB de mem├│ria GDDR7 e barramento de 128 bits, ela ├® ideal para quem busca performance s├│lida em jogos Full HD e excelente efici├¬ncia energ├®tica em um design elegante e compacto.	4	PVID-937	9c1f1c46-0be8-4e3b-888e-b889d5ad6f05	2025-07-21 00:54:58.751	2025-07-21 01:00:49.949
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
\.


--
-- Data for Name: RefreshToken; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."RefreshToken" (id, user_id, token, created_at, expires_at) FROM stdin;
760a42a9-2c47-48a5-a5e0-f4eac2de2bd4	ec7d7252-c235-45c5-b702-6ff8ec749b0c	eyJhbGciOiJIUzUxMiJ9.eyJ1c2VyX2lkIjoiZWM3ZDcyNTItYzIzNS00NWM1LWI3MDItNmZmOGVjNzQ5YjBjIiwiZW1haWwiOiJsZW9uYXJkby5hbHZhcmVuZ2FAZ21haWwuY29tIiwicm9sZSI6IkFETUlOIiwiaWF0IjoxNzUzMTI3MTgwLCJleHAiOjE3NTM3MzE5ODB9.XQ8weZEL_Txyaq8M1tT3UQbyprV9ttCJ1fi5VtCoRMujsOry4kLgS3zRVdcmHwMhxoSUSnB7zx3-RrWZYz_hXg	2025-07-21 19:46:20.422	2025-07-28 19:46:20.42
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
ec7d7252-c235-45c5-b702-6ff8ec749b0c	leonardo.alvarenga@gmail.com	Leonardo Prado	$2b$12$67hnFWIO7rVA8lzu.J0iM.z6LYJBblF4GjQsQMEprVK/soUpVkW.i	\N	ADMIN	2025-07-20 22:48:36.749	2025-07-20 22:48:49.096
\.


--
-- Data for Name: UserAddress; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."UserAddress" (address_id, user_id, street, number, city, state, zip_code, complement) FROM stdin;
ea3d814f-e555-4a21-8789-05c8dd566a5a	ec7d7252-c235-45c5-b702-6ff8ec749b0c	ADOLFO HUMEL GUIMARAES	25	JundiaÔö£┬í/SP	SP	13201-620	
06e36c3d-7f04-453f-b109-0cff89d6a5c2	ec7d7252-c235-45c5-b702-6ff8ec749b0c	ADOLFO HUMEL GUIMARAES	25	Jundia├¡/SP	SP	13201-620	
\.


--
-- Data for Name: Wishlist; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Wishlist" (id, user_id, created_at, updated_at) FROM stdin;
215ef494-9936-41a4-bd66-865154f8087e	ec7d7252-c235-45c5-b702-6ff8ec749b0c	2025-07-20 22:48:36.775	2025-07-20 22:48:36.775
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

