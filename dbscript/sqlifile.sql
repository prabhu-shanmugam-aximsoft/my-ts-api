--
-- PostgreSQL database dump
--

\restrict SgObz4PRfpvhXqKXY6pPCZwrovQTJ2UJkOoribIGeTJlYTonwgVshaU1MgdhTRd

-- Dumped from database version 16.13 (Ubuntu 16.13-0ubuntu0.24.04.1)
-- Dumped by pg_dump version 16.13 (Ubuntu 16.13-0ubuntu0.24.04.1)

-- Started on 2026-05-06 10:59:41 IST

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
-- TOC entry 4 (class 2615 OID 2200)
-- Name: public; Type: SCHEMA; Schema: -; Owner: pg_database_owner
--

CREATE SCHEMA public;


ALTER SCHEMA public OWNER TO pg_database_owner;

--
-- TOC entry 3461 (class 0 OID 0)
-- Dependencies: 4
-- Name: SCHEMA public; Type: COMMENT; Schema: -; Owner: pg_database_owner
--

COMMENT ON SCHEMA public IS 'standard public schema';


--
-- TOC entry 226 (class 1255 OID 16802)
-- Name: create_contact(text, text, text); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.create_contact(p_full_name text, p_email text, p_message text) RETURNS TABLE(id integer, full_name character varying, email character varying, message text)
    LANGUAGE plpgsql
    AS $$
BEGIN
  RETURN QUERY
  INSERT INTO contact_submissions as cs  (full_name, email, message)
  VALUES (p_full_name, p_email, p_message)
  RETURNING cs.id,  cs.full_name,  cs.email, cs.message;
END;
$$;


ALTER FUNCTION public.create_contact(p_full_name text, p_email text, p_message text) OWNER TO postgres;

--
-- TOC entry 222 (class 1255 OID 16780)
-- Name: create_user(text, text, text, text); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.create_user(p_name text, p_email text, p_password text, p_role text DEFAULT 'user'::text) RETURNS TABLE(id integer, name text, email text, role text)
    LANGUAGE plpgsql
    AS $$
BEGIN
  -- enforce unique email
  IF EXISTS (SELECT 1 FROM users WHERE email = p_email) THEN
    RAISE EXCEPTION 'Email already used';
  END IF;

  RETURN QUERY
  INSERT INTO users(name, email, password, role)
  VALUES (p_name, p_email, p_password, p_role)
  RETURNING id, name, email, role;
END;
$$;


ALTER FUNCTION public.create_user(p_name text, p_email text, p_password text, p_role text) OWNER TO postgres;

--
-- TOC entry 224 (class 1255 OID 16799)
-- Name: delete_contact(integer); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.delete_contact(p_id integer) RETURNS TABLE(id integer, full_name character varying, email character varying, message text)
    LANGUAGE plpgsql
    AS $$
BEGIN
  RETURN QUERY
  DELETE FROM contact_submissions c
  WHERE c.id = p_id
  RETURNING c.id, c.full_name, c.email, c.message;
END;
$$;


ALTER FUNCTION public.delete_contact(p_id integer) OWNER TO postgres;

--
-- TOC entry 225 (class 1255 OID 16800)
-- Name: delete_user(integer); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.delete_user(p_id integer) RETURNS TABLE(id integer, name character varying, email character varying, role character varying)
    LANGUAGE plpgsql
    AS $$
BEGIN
  RETURN QUERY
  DELETE FROM users u
  WHERE u.id = p_id
  RETURNING u.id, u.name, u.email, u.role;
END;
$$;


ALTER FUNCTION public.delete_user(p_id integer) OWNER TO postgres;

--
-- TOC entry 223 (class 1255 OID 16798)
-- Name: find_contact_by_id(integer); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.find_contact_by_id(p_id integer) RETURNS TABLE(id integer, full_name character varying, email character varying, message text)
    LANGUAGE plpgsql
    AS $$
BEGIN
  RETURN QUERY
  SELECT contact_submissions.id, contact_submissions.full_name, contact_submissions.email, contact_submissions.message
  FROM contact_submissions
  WHERE contact_submissions.id = p_id;
END;
$$;


ALTER FUNCTION public.find_contact_by_id(p_id integer) OWNER TO postgres;

--
-- TOC entry 219 (class 1255 OID 16786)
-- Name: find_user_by_email(text); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.find_user_by_email(p_email text) RETURNS TABLE(id integer, name character varying, email character varying, password text, role character varying)
    LANGUAGE plpgsql
    AS $$
BEGIN
  RETURN QUERY
  SELECT users.id , users.name , users.email , users.password , users.role FROM users WHERE users.email = p_email;
END;
$$;


ALTER FUNCTION public.find_user_by_email(p_email text) OWNER TO postgres;

--
-- TOC entry 220 (class 1255 OID 16787)
-- Name: find_user_by_id(integer); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.find_user_by_id(p_id integer) RETURNS TABLE(id integer, name character varying, email character varying, role character varying)
    LANGUAGE plpgsql
    AS $$
BEGIN
  RETURN QUERY
  SELECT users.id, users.name, users.email, users.role
  FROM users
  WHERE users.id = p_id;
END;
$$;


ALTER FUNCTION public.find_user_by_id(p_id integer) OWNER TO postgres;

--
-- TOC entry 238 (class 1255 OID 16797)
-- Name: get_all_contacts(integer, integer); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.get_all_contacts(p_limit integer, p_offset integer) RETURNS TABLE(id integer, full_name character varying, email character varying, message text)
    LANGUAGE plpgsql
    AS $$
BEGIN
  RETURN QUERY
  SELECT contact_submissions.id, contact_submissions.full_name, contact_submissions.email, contact_submissions.message
  FROM contact_submissions
  ORDER BY created_at DESC
  LIMIT p_limit OFFSET p_offset;
END;
$$;


ALTER FUNCTION public.get_all_contacts(p_limit integer, p_offset integer) OWNER TO postgres;

--
-- TOC entry 221 (class 1255 OID 16788)
-- Name: get_all_users(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.get_all_users() RETURNS TABLE(id integer, name character varying, email character varying, role character varying)
    LANGUAGE plpgsql
    AS $$
BEGIN
  RETURN QUERY
  SELECT users.id, users.name, users.email, users.role FROM users;
END;
$$;


ALTER FUNCTION public.get_all_users() OWNER TO postgres;

--
-- TOC entry 239 (class 1255 OID 16796)
-- Name: update_user(integer, character varying, character varying, text, character varying); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.update_user(p_id integer, p_name character varying DEFAULT NULL::character varying, p_email character varying DEFAULT NULL::character varying, p_password text DEFAULT NULL::text, p_role character varying DEFAULT NULL::character varying) RETURNS TABLE(id integer, name character varying, email character varying, role character varying)
    LANGUAGE plpgsql
    AS $$
BEGIN
  -- email uniqueness check (case-insensitive)
  IF p_email IS NOT NULL THEN
    IF EXISTS (
      SELECT 1
      FROM users u
      WHERE LOWER(u.email) = LOWER(p_email)
        AND u.id != p_id
    ) THEN
      RAISE EXCEPTION 'Email already used';
    END IF;
  END IF;

  RETURN QUERY
  UPDATE users u
  SET
    name     = COALESCE(p_name, u.name),
    email    = COALESCE(p_email, u.email),
    password = COALESCE(p_password, u.password),
    role     = COALESCE(p_role, u.role)
  WHERE u.id = p_id
  RETURNING u.id, u.name, u.email, u.role;

  -- handle not found
  IF NOT FOUND THEN
    RAISE EXCEPTION 'User not found';
  END IF;

END;
$$;


ALTER FUNCTION public.update_user(p_id integer, p_name character varying, p_email character varying, p_password text, p_role character varying) OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 218 (class 1259 OID 16405)
-- Name: contact_submissions; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.contact_submissions (
    id integer NOT NULL,
    full_name character varying(100) NOT NULL,
    email character varying(100) NOT NULL,
    message text NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT chk_email_format CHECK (((email)::text ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'::text))
);


ALTER TABLE public.contact_submissions OWNER TO postgres;

--
-- TOC entry 217 (class 1259 OID 16404)
-- Name: contact_submissions_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.contact_submissions_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.contact_submissions_id_seq OWNER TO postgres;

--
-- TOC entry 3462 (class 0 OID 0)
-- Dependencies: 217
-- Name: contact_submissions_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.contact_submissions_id_seq OWNED BY public.contact_submissions.id;


--
-- TOC entry 216 (class 1259 OID 16390)
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    id integer NOT NULL,
    name character varying(100) NOT NULL,
    email character varying(100) NOT NULL,
    password text NOT NULL,
    role character varying(20) DEFAULT 'user'::character varying,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT chk_role CHECK (((role)::text = ANY ((ARRAY['admin'::character varying, 'user'::character varying])::text[])))
);


ALTER TABLE public.users OWNER TO postgres;

--
-- TOC entry 215 (class 1259 OID 16389)
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.users_id_seq OWNER TO postgres;

--
-- TOC entry 3463 (class 0 OID 0)
-- Dependencies: 215
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- TOC entry 3301 (class 2604 OID 16408)
-- Name: contact_submissions id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.contact_submissions ALTER COLUMN id SET DEFAULT nextval('public.contact_submissions_id_seq'::regclass);


--
-- TOC entry 3298 (class 2604 OID 16393)
-- Name: users id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- TOC entry 3311 (class 2606 OID 16413)
-- Name: contact_submissions contact_submissions_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.contact_submissions
    ADD CONSTRAINT contact_submissions_pkey PRIMARY KEY (id);


--
-- TOC entry 3307 (class 2606 OID 16401)
-- Name: users users_email_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);


--
-- TOC entry 3309 (class 2606 OID 16399)
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- TOC entry 3312 (class 1259 OID 16414)
-- Name: idx_contact_submissions_email; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_contact_submissions_email ON public.contact_submissions USING btree (email);


--
-- TOC entry 3305 (class 1259 OID 16402)
-- Name: idx_users_email_lower; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX idx_users_email_lower ON public.users USING btree (lower((email)::text));


-- Completed on 2026-05-06 10:59:41 IST

--
-- PostgreSQL database dump complete
--

\unrestrict SgObz4PRfpvhXqKXY6pPCZwrovQTJ2UJkOoribIGeTJlYTonwgVshaU1MgdhTRd

