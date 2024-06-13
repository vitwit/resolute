--
-- PostgreSQL database dump
--

-- Dumped from database version 12.12 (Ubuntu 12.12-0ubuntu0.20.04.1)
-- Dumped by pg_dump version 12.12 (Ubuntu 12.12-0ubuntu0.20.04.1)

-- Started on 2022-09-24 20:18:09 IST

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
-- TOC entry 626 (class 1247 OID 16424)
-- Name: transaction_status; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.transaction_status AS ENUM (
    'PENDING',
    'SUCCESS',
    'FAILED'
);


--
-- TOC entry 637 (class 1247 OID 16868)
-- Name: tx_status; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.tx_status AS ENUM (
    'SUCCESS',
    'PENDING',
    'FAILED'
);


SET default_table_access_method = heap;

--
-- TOC entry 204 (class 1259 OID 16822)
-- Name: multisig_accounts; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.multisig_accounts (
    address character varying(50) NOT NULL,
    threshold integer NOT NULL,
    chain_id character varying(20) NOT NULL,
    pubkey_type character varying(50) NOT NULL,
    name character varying(20) NOT NULL,
    created_by character varying(50) NOT NULL,
    created_at timestamp with time zone DEFAULT '2022-09-23 22:26:53.911454+05:30'::timestamp with time zone NOT NULL
);


--
-- TOC entry 205 (class 1259 OID 16840)
-- Name: pubkeys; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.pubkeys (
    address character varying(50) NOT NULL,
    multisig_address character varying(50) NOT NULL,
    pubkey jsonb NOT NULL
);


--
-- TOC entry 207 (class 1259 OID 16877)
-- Name: transactions; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.transactions (
    id integer NOT NULL,
    multisig_address character varying(50) NOT NULL,
    fee jsonb,
    status public.tx_status DEFAULT 'PENDING'::public.tx_status NOT NULL,
    messages jsonb DEFAULT '[]'::jsonb,
    hash text DEFAULT ''::text,
    err_msg text DEFAULT ''::text,
    memo text DEFAULT ''::text,
    signatures jsonb DEFAULT '[]'::jsonb,
    last_updated timestamp with time zone DEFAULT '2022-09-23 22:26:53.911454+05:30'::timestamp with time zone NOT NULL,
    created_at timestamp with time zone DEFAULT '2022-09-23 22:27:24.815343+05:30'::timestamp with time zone NOT NULL
);

--
-- TOC entry 206 (class 1259 OID 16444)
-- Name: price_info; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.price_info (
    denom character varying(50) NOT NULL,
    coingecko_name character varying(50) NOT NULL,
    enabled boolean DEFAULT true NOT NULL,
    last_updated timestamp with time zone,
    info jsonb DEFAULT '{}'::jsonb
);


--
-- TOC entry 2969 (class 0 OID 16444)
-- Dependencies: 206
-- Data for Name: price_info; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.price_info (denom, coingecko_name, enabled, last_updated, info) FROM stdin;
uatom	cosmos	t	2022-10-04 09:10:29.043476+00	{}
uregen	regen	t	2022-10-04 09:10:29.043476+00	{}
uosmo	osmosis	t	2022-10-04 09:10:29.043476+00	{}
ujuno	juno-network	t	2022-10-04 09:10:29.043476+00	{}
ustars	stargaze	t	2022-10-04 09:10:29.043476+00	{}
uakt	akash-network	t	2022-10-04 09:10:29.043476+00	{}
\.



--
-- TOC entry 206 (class 1259 OID 16875)
-- Name: transactions_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.transactions_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 3005 (class 0 OID 0)
-- Dependencies: 206
-- Name: transactions_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.transactions_id_seq OWNED BY public.transactions.id;


--
-- TOC entry 2857 (class 2604 OID 16880)
-- Name: transactions id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.transactions ALTER COLUMN id SET DEFAULT nextval('public.transactions_id_seq'::regclass);


--
-- TOC entry 2867 (class 2606 OID 16952)
-- Name: multisig_accounts multisig_accounts_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.multisig_accounts
    ADD CONSTRAINT multisig_accounts_pkey PRIMARY KEY (address);


--
-- TOC entry 2869 (class 2606 OID 17014)
-- Name: pubkeys pubkeys_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.pubkeys
    ADD CONSTRAINT pubkeys_pkey PRIMARY KEY (address, multisig_address);


--
-- TOC entry 2871 (class 2606 OID 16890)
-- Name: transactions transactions_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.transactions
    ADD CONSTRAINT transactions_pkey PRIMARY KEY (id);


--
-- TOC entry 2872 (class 2606 OID 17015)
-- Name: pubkeys pubkeys_multisig_address_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.pubkeys
    ADD CONSTRAINT pubkeys_multisig_address_fkey FOREIGN KEY (multisig_address) REFERENCES public.multisig_accounts(address);


--
-- TOC entry 2873 (class 2606 OID 17028)
-- Name: transactions transactions_multisig_address_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.transactions
    ADD CONSTRAINT transactions_multisig_address_fkey FOREIGN KEY (multisig_address) REFERENCES public.multisig_accounts(address);


-- Completed on 2022-09-24 20:18:09 IST

--
-- PostgreSQL database dump complete
--

