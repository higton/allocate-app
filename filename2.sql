--
-- PostgreSQL database dump
--

-- Dumped from database version 14.8 (Ubuntu 14.8-0ubuntu0.22.04.1)
-- Dumped by pg_dump version 14.8 (Ubuntu 14.8-0ubuntu0.22.04.1)

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

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: account; Type: TABLE; Schema: public; Owner: me
--

CREATE TABLE public.account (
    id integer NOT NULL,
    email character varying(30) NOT NULL,
    password character varying(200) NOT NULL
);


ALTER TABLE public.account OWNER TO me;

--
-- Name: account_id_seq; Type: SEQUENCE; Schema: public; Owner: me
--

CREATE SEQUENCE public.account_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.account_id_seq OWNER TO me;

--
-- Name: account_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: me
--

ALTER SEQUENCE public.account_id_seq OWNED BY public.account.id;


--
-- Name: classroom; Type: TABLE; Schema: public; Owner: me
--

CREATE TABLE public.classroom (
    id integer NOT NULL,
    name character varying(30) NOT NULL,
    number_of_seats integer NOT NULL,
    time_slot character varying(500) NOT NULL
);


ALTER TABLE public.classroom OWNER TO me;

--
-- Name: classroom_id_seq; Type: SEQUENCE; Schema: public; Owner: me
--

CREATE SEQUENCE public.classroom_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.classroom_id_seq OWNER TO me;

--
-- Name: classroom_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: me
--

ALTER SEQUENCE public.classroom_id_seq OWNED BY public.classroom.id;


--
-- Name: course; Type: TABLE; Schema: public; Owner: me
--

CREATE TABLE public.course (
    id integer NOT NULL,
    name character varying(255) NOT NULL,
    professor character varying(255) NOT NULL,
    group_period character varying(50) NOT NULL,
    department character varying(50) NOT NULL,
    localthreshold integer NOT NULL,
    time_slot character varying(600) NOT NULL,
    classrooms character varying(600) NOT NULL,
    semester_period character varying(20) NOT NULL,
    seat_count integer NOT NULL
);


ALTER TABLE public.course OWNER TO me;

--
-- Name: course_id_seq; Type: SEQUENCE; Schema: public; Owner: me
--

CREATE SEQUENCE public.course_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.course_id_seq OWNER TO me;

--
-- Name: course_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: me
--

ALTER SEQUENCE public.course_id_seq OWNED BY public.course.id;


--
-- Name: account id; Type: DEFAULT; Schema: public; Owner: me
--

ALTER TABLE ONLY public.account ALTER COLUMN id SET DEFAULT nextval('public.account_id_seq'::regclass);


--
-- Name: classroom id; Type: DEFAULT; Schema: public; Owner: me
--

ALTER TABLE ONLY public.classroom ALTER COLUMN id SET DEFAULT nextval('public.classroom_id_seq'::regclass);


--
-- Name: course id; Type: DEFAULT; Schema: public; Owner: me
--

ALTER TABLE ONLY public.course ALTER COLUMN id SET DEFAULT nextval('public.course_id_seq'::regclass);


--
-- Data for Name: account; Type: TABLE DATA; Schema: public; Owner: me
--

COPY public.account (id, email, password) FROM stdin;
1	hilgton@gmail.com	$2b$10$TKAqnNPx1GP.bDCuNElYzuGp8Dr0Vu2SpGC4OZayDh.6iV7HNn3mm
\.


--
-- Data for Name: classroom; Type: TABLE DATA; Schema: public; Owner: me
--

COPY public.classroom (id, name, number_of_seats, time_slot) FROM stdin;
2	FGA-I1 	45	
3	FGA-I2	60	
4	FGA-I3	60	
5	FGA-I4	45	
6	FGA-I5	45	
7	FGA-I6	40	
8	FGA-I7	40	
9	FGA-I8	45	
10	FGA-I9	130	
11	FGA-I10	80	
12	FGA-S1	130	
13	FGA-S2	130	
14	FGA-S3	130	
15	FGA-S4	130	
16	FGA-S5	45	
17	FGA-S6	60	
18	FGA-S7	60	
19	FGA-S8	45	
20	FGA-S9	130	
21	FGA-S10	80	
22	FGA-Antessala I10	7	
23	FGA-Sala Multiuso	15	
24	FGA-ANFITEATRO	250	
25	FGA-LAB SS	50	
26	FGA-LAB MOCAP	50	
\.


--
-- Data for Name: course; Type: TABLE DATA; Schema: public; Owner: me
--

COPY public.course (id, name, professor, group_period, department, localthreshold, time_slot, classrooms, semester_period, seat_count) FROM stdin;
3	FGA0003 - COMPILADORES 1 - Turma 2	LUIS FILOMENO DE JESUS FERNANDES	2 2	Software	0	2m1,2m2,2m3,2m4,2t2,2t3,2t4,2t5,2t6,3m1,3m2,3m3,3m4,3t2,3t3,3t4,3t5,3t6,4m1,4m2,4m3,4m4,4t2,4t3,4t4,4t5,4t6,5m1,5m2,5m3,5m4,5t2,5t3,5t4,5t5,5t6,6m1,6m2,6m3,6m4,6t2,6t3,6t4,6t5,6t6	FGA-I9,FGA-S3,FGA-I10,FGA-S1,FGA-S4,FGA-S10,FGA-S2	5	70
6	FGA0053 - TÓPICOS ESPECIAIS EM PROGRAMAÇÃO	EDSON ALVES DA COSTA JUNIOR	2 2	Software	0	2m1,2m2,2m3,2m4,2t3,2t4,2t5,2t2,3m1,3m2,3m3,3m4,3t2,3t3,3t4,3t5,4m1,4m2,4m3,4m4,4t2,4t3,4t4,4t5,5m1,5m2,5m3,5m4,5t2,5t3,5t4,5t5,6m1,6m2,6m3,6m4,6t2,6t3,6t4,6t5	FGA-I2,FGA-I3,FGA-I10,FGA-I9,FGA-S1,FGA-S3,FGA-S2,FGA-S4,FGA-S6,FGA-S7,FGA-S9,FGA-S10	11	49
5	FGA0030 - ESTRUTURAS DE DADOS 2 - Turma 2	BRUNO CESAR RIBAS	2 2	Software	0	2m1,2m2,2m3,2m4,2t2,2t3,2t4,2t5,3m1,3m2,3m3,3m4,3t2,3t3,3t4,3t5,4m1,4m2,4m3,4m4,4t2,4t3,4t4,4t5,5m1,5m2,5m3,5m4,5t2,5t3,5t4,5t5,6m1,6m2,6m3,6m4,6t2,6t3,6t4,6t5	FGA-I9,FGA-S1,FGA-S3,FGA-S2,FGA-S4,FGA-S9	5	110
7	 FGA0054 - TÓPICOS ESPECIAIS EM GOVERNANÇA DE TECNOLOGIA DA INFORMAÇÃO	WANDER CLEBER MARIA PEREIRA DA SILVA	2 2	Software	0	2m1,2m2,2m3,2m4,2t2,2t3,2t4,2t5,3m1,3m2,3m3,3m4,3t2,3t3,3t4,3t5,4m1,4m2,4m3,4m4,4t2,4t3,4t4,4t5,5m1,5m2,5m3,5m4,5t2,5t3,5t4,5t5,6m1,6m2,6m3,6m4,6t2,6t3,6t4,6t5	FGA-I9,FGA-I10,FGA-S1,FGA-S2,FGA-S3,FGA-S4,FGA-S9,FGA-S10	11	70
9	FGA0083 - APRENDIZADO DE MÁQUINA	FABRICIO ATAIDES BRAZ	2 2	Software	0	2m1,2m2,2m3,2m4,2t2,2t3,2t4,2t5,3m1,3m2,3m3,3m4,3t2,3t3,3t4,3t5,4m1,4m2,4m3,4m4,4t2,4t3,4t4,4t5,5m1,5m2,5m3,5m4,5t2,5t3,5t4,5t5,6m1,6m2,6m3,6m4,6t2,6t3,6t4,6t5	FGA-I2,FGA-I3,FGA-I9,FGA-I10,FGA-S1,FGA-S2,FGA-S3,FGA-S4,FGA-S6,FGA-S7,FGA-S9,FGA-S10	11	60
11	FGA0085 - MATEMÁTICA DISCRETA 1 - Turma 1	GLAUCO VITOR PEDROSA	2 2	Software	0	2m1,2m2,2m3,2m4,2t2,2t3,2t4,2t5,3m1,3m2,3m3,3m4,3t2,3t3,3t4,3t5,4m1,4m2,4m3,4m4,4t2,4t3,4t4,4t5,5m1,5m2,5m3,5m4,5t2,5t3,5t4,5t5,6m1,6m2,6m3,6m4,6t2,6t3,6t4,6t5	FGA-I9,FGA-S1,FGA-S2,FGA-S3,FGA-S4,FGA-S9	3	110
10	FGA0084 - DESENVOLVIMENTO DE SOFTWARE	SERGIO ANTONIO ANDRADE DE FREITAS	2 2	Software	0	2m1,2m2,2m3,2m4,2t2,2t3,2t4,2t5,3m1,3m2,3m3,3m4,3t2,3t3,3t4,3t5,4m1,4m2,4m3,4m4,4t2,4t3,4t4,4t5,5m1,5m2,5m3,5m4,5t2,5t3,5t4,5t5,6m1,6m2,6m3,6m4,6t2,6t3,6t4,6t5	FGA-I9,FGA-I10,FGA-S1,FGA-S2,FGA-S3,FGA-S4,FGA-S9,FGA-S10	2	70
13	FGA0073 - TEORIA DE ELETRÔNICA DIGITAL 1	RENATO VILELA LOPES	2 2	Software	0	2m1,2m2,2m3,2m4,2t2,2t3,2t4,2t5,3m1,3m2,3m3,3m4,3t2,3t3,3t4,3t5,4m1,4m2,4m3,4m4,4t2,4t3,4t4,4t5,5m1,5m2,5m3,5m4,5t2,5t3,5t4,5t5,6m1,6m2,6m3,6m4,6t2,6t3,6t4,6t5	FGA-I9,FGA-S1,FGA-S2,FGA-S3,FGA-S4,FGA-S9	3	110
16	FGA0124 - PROJETO DE ALGORITMOS	MAURICIO SERRANO	2 2	Software	0	2m1,2m2,2m3,2m4,2t2,2t3,2t4,2t5,3m1,3m2,3m3,3m4,3t2,3t3,3t4,3t5,4m1,4m2,4m3,4m4,4t2,4t3,4t4,4t5,5m1,5m2,5m3,5m4,5t2,5t3,5t4,5t5,6m1,6m2,6m3,6m4,6t2,6t3,6t4,6t5	FGA-I9,FGA-S1,FGA-S2,FGA-S3,FGA-S4,FGA-S9	6	110
17	FGA0131 - ENGENHARIA DE SOFTWARE AUTOMOTIVO	EVANDRO LEONARDO SILVA TEIXEIRA	2 2	Software	0	2m1,2m2,2m3,2m4,2t2,2t3,2t4,2t5,3m1,3m2,3m3,3m4,3t2,3t3,3t4,3t5,4m1,4m2,4m3,4m4,4t2,4t3,4t4,4t5,5m1,5m2,5m3,5m4,5t2,5t3,5t4,5t5,6m1,6m2,6m3,6m4,6t2,6t3,6t4,6t5	FGA-I1 ,FGA-I2,FGA-I3,FGA-I4,FGA-I5,FGA-I6,FGA-I8,FGA-I7,FGA-I9,FGA-I10,FGA-S1,FGA-S2,FGA-S3,FGA-S4,FGA-S5,FGA-S6,FGA-S8,FGA-S7,FGA-S9,FGA-S10	11	16
14	FGA0073 - TEORIA DE ELETRÔNICA DIGITAL 1 - Turma 2	RENATO VILELA LOPES	2 2	Software	0	2m1,2m2,2m3,2m4,2t3,2t4,2t5,2t2,3m1,3m2,3m3,3m4,3t2,3t3,3t4,3t5,4m1,4m2,4m3,4m4,4t2,4t3,4t4,4t5,5m1,5m2,5m3,5m4,5t2,5t3,5t4,5t5,6m1,6m2,6m3,6m4,6t2,6t3,6t4,6t5	FGA-I9,FGA-S1,FGA-S2,FGA-S3,FGA-S4,FGA-S9	3	110
15	FGA0108 - MATEMÁTICA DISCRETA 2	MATHEUS BERNARDINI DE SOUZA	2 2	Software	0	2m1,2m2,2m3,2m4,2t2,2t3,2t4,2t5,3m1,3m2,3m3,3m4,3t2,3t3,3t4,3t5,4m1,4m2,4m3,4m4,4t2,4t3,4t4,4t5,5m1,5m2,5m3,5m4,5t2,5t3,5t4,5t5,6m1,6m2,6m3,6m4,6t2,6t3,6t4,6t5	FGA-I9,FGA-S1,FGA-S2,FGA-S3,FGA-S4,FGA-S9	4	110
2	FGA0003 - COMPILADORES 1 - Turma 1	EDSON ALVES DA COSTA JUNIOR (60h)	2 2	Software	0	2m1,2m2,2m3,2m4,2t2,2t3,2t4,2t5,2t6,2n1,3m1,3m2,3m3,3m4,3t2,3t3,3t4,3t5,3t6,3n1,4m1,4m2,4m3,4m4,4t2,4t3,4t4,4t5,4t6,4n1,5m1,5m2,5m3,5m4,5t2,5t3,5t4,5t5,5t6,5n1,6m1,6m2,6m3,6m4,6t2,6t3,6t4,6t5,6t6,6n1	FGA-I8,FGA-I4,FGA-I9,FGA-I10,FGA-S1,FGA-S2,FGA-S3,FGA-S4,FGA-S5,FGA-S6	5	45
18	FGA0134 - TÓPICOS ESPECIAIS DE ENGENHARIA DE SOFTWARE - Turma 1	WANDER CLEBER MARIA PEREIRA DA SILVA	2 2	Software	0	2m1,2m2,2m3,2m4,2m5,2t1,2t2,2t3,2t4,2t5,3m1,3m2,3m3,3m4,3m5,3t1,3t2,3t3,3t4,3t5,4m1,4m2,4m3,4m4,4m5,4t1,4t2,4t3,4t4,4t5,5m1,5m2,5m3,5m4,5m5,5t1,5t2,5t3,5t4,5t5,6m1,6m2,6m3,6m4,6m5,6t1,6t2,6t3,6t4,6t5	FGA-ANFITEATRO	9	240
12	 FGA0085 - MATEMÁTICA DISCRETA 1 - Turma 2	GLAUCO VITOR PEDROSA	2 2	Software	0	2m1,2m2,2m3,2m4,2t2,2t3,2t4,2t5,3m1,3m2,3m3,3m4,3t2,3t3,3t4,3t5,4m1,4m2,4m3,4m4,4t2,4t3,4t4,4t5,5m1,5m2,5m3,5m4,5t2,5t3,5t4,5t5,6m1,6m2,6m3,6m4,6t2,6t3,6t4,6t5	FGA-I9,FGA-S2,FGA-S1,FGA-S3,FGA-S4,FGA-S9	3	110
19	FGA0134 - TÓPICOS ESPECIAIS DE ENGENHARIA DE SOFTWARE - Turma 2	BRUNO CESAR RIBAS	2 2	Software	0	2m1,2m2,2m3,2m4,2t2,2t3,2t4,2t5,3m1,3m2,3m3,3m4,3t2,3t3,3t4,3t5,4m1,4m2,4m3,4m4,4t2,4t3,4t4,4t5,5m1,5m2,5m3,5m4,5t2,5t3,5t4,5t5,6m1,6m2,6m3,6m4,6t2,6t3,6t4,6t5	FGA-I9,FGA-I10,FGA-S1,FGA-S2,FGA-S3,FGA-S4,FGA-S9,FGA-S10	9	70
4	FGA0030 - ESTRUTURAS DE DADOS 2	JOHN LENON CARDOSO GARDENGHI	2 2	Software	0	2m1,2m2,2m3,2m4,2t3,2t4,2t5,2t2,3m1,3m2,3m3,3m4,3t2,3t3,3t4,3t5,4m1,4m2,4m3,4m4,4t2,4t3,4t4,4t5,5m1,5m2,5m3,5m4,5t2,5t3,5t4,5t5,6m1,6m2,6m3,6m4,6t2,6t3,6t4,6t5	FGA-I9,FGA-S1,FGA-S2,FGA-S3,FGA-S4,FGA-S9	5	110
8	FGA0060 - SISTEMAS DE BANCO DE DADOS 2	VANDOR ROBERTO VILARDI RISSOLI	2 2	Software	0	2m1,2m2,2m3,2m4,2t2,2t3,2t4,2t5,3m1,3m2,3m3,3m4,3t2,3t3,3t4,3t5,4m1,4m2,4m3,4m4,4t2,4t3,4t4,4t5,5m1,5m2,5m3,5m4,5t2,5t3,5t4,5t5,6m1,6m2,6m3,6m4,6t2,6t3,6t4,6t5	FGA-I2,FGA-I3,FGA-I9,FGA-I10,FGA-S1,FGA-S2,FGA-S3,FGA-S4,FGA-S6,FGA-S7,FGA-S9,FGA-S10	6	49
22	FGA0138 - MÉTODOS DE DESENVOLVIMENTO DE SOFTWARE	HILMER RODRIGUES NERI	2 2	Software	0	2m1,2m2,2m3,2m4,2t2,2t3,2t4,2t5,3m1,3m2,3m3,3m4,3t2,3t3,3t4,3t5,4m1,4m2,4m3,4m4,4t2,4t3,4t4,4t5,5m1,5m2,5m3,5m4,5t2,5t3,5t4,5t5,6m1,6m2,6m3,6m4,6t2,6t3,6t4,6t5	FGA-I2,FGA-I3,FGA-I9,FGA-I10,FGA-S1,FGA-S2,FGA-S3,FGA-S4,FGA-S6,FGA-S7,FGA-S9,FGA-S10	4	49
23	FGA0138 - MÉTODOS DE DESENVOLVIMENTO DE SOFTWARE - Turma 2	GEORGE MARSICANO CORREA	2 2	Software	0	2m1,2m2,2m3,2m4,2t2,2t3,2t4,2t5,3m1,3m2,3m3,3m4,3t2,3t3,3t4,3t5,4m1,4m2,4m3,4m4,4t2,4t3,4t4,4t5,5m1,5m2,5m3,5m4,5t2,5t3,5t4,5t5,6m1,6m2,6m3,6m4,6t2,6t3,6t4,6t5	FGA-I2,FGA-I3,FGA-I9,FGA-I10,FGA-S1,FGA-S2,FGA-S3,FGA-S4,FGA-S6,FGA-S7,FGA-S9,FGA-S10	4	48
28	FGA0147 - ESTRUTURA DE DADOS E ALGORITMOS - Turma 1	NILTON CORREIA DA SILVA	2 2	Software	0	2m1,2m2,2m3,2m4,2t2,2t3,2t4,2t5,3m1,3m2,3m3,3m4,3t2,3t3,3t4,3t5,4m1,4m2,4m3,4m4,4t2,4t3,4t4,4t5,5m1,5m2,5m3,5m4,5t2,5t3,5t4,5t5,6m1,6m2,6m3,6m4,6t2,6t3,6t4,6t5	FGA-I9,FGA-I10,FGA-S1,FGA-S2,FGA-S3,FGA-S4,FGA-S9,FGA-S10	4	70
25	FGA0138 - MÉTODOS DE DESENVOLVIMENTO DE SOFTWARE - Turma 4	RICARDO AJAX DIAS KOSLOSKI	2 2	Software	0	2m1,2m2,2m3,2m4,2t2,2t3,2t4,2t5,3m1,3m2,3m3,3m4,3t2,3t3,3t4,3t5,4m1,4m2,4m3,4m4,4t2,4t3,4t4,4t5,5m1,5m2,5m3,5m4,5t2,5t3,5t4,5t5,6m1,6m2,6m3,6m4,6t2,6t3,6t4,6t5	FGA-I2,FGA-I3,FGA-I9,FGA-I10,FGA-S2,FGA-S1,FGA-S3,FGA-S4,FGA-S6,FGA-S7,FGA-S9,FGA-S10	4	50
26	 FGA0142 - FUNDAMENTOS DE ARQUITETURA DE COMPUTADORES - Turma 1	TIAGO ALVES DA FONSECA	2 2	Software	0	2m1,2m2,2m3,2m4,2t2,2t3,2t4,2t5,3m1,3m2,3m3,3m4,3t2,3t3,3t4,3t5,4m1,4m2,4m3,4m4,4t2,4t3,4t4,4t5,5m1,5m2,5m3,5m4,5t2,5t3,5t4,5t5,6m1,6m2,6m3,6m4,6t2,6t3,6t4,6t5	FGA-I2,FGA-I3,FGA-I9,FGA-I10,FGA-S2,FGA-S1,FGA-S3,FGA-S4,FGA-S6,FGA-S7,FGA-S9,FGA-S10	4	60
24	FGA0138 - MÉTODOS DE DESENVOLVIMENTO DE SOFTWARE - Turma 3	GEORGE MARSICANO CORREA	2 2	Software	0	2m1,2m2,2m3,2m4,2t2,2t3,2t4,2t5,3m1,3m2,3m3,3m4,3t2,3t3,3t4,3t5,4m1,4m2,4m3,4m4,4t2,4t3,4t4,4t5,5m1,5m2,5m3,5m4,5t2,5t3,5t4,5t5,6m1,6m2,6m3,6m4,6t2,6t3,6t4,6t5	FGA-I2,FGA-I3,FGA-I9,FGA-I10,FGA-S1,FGA-S2,FGA-S3,FGA-S4,FGA-S6,FGA-S7,FGA-S9,FGA-S10	5	48
29	FGA0147 - ESTRUTURA DE DADOS E ALGORITMOS - Turma 2	ROSE YURI SHIMIZU	2 2	Software	0	2m1,2m2,2m3,2m4,2t2,2t3,2t4,2t5,3m1,3m2,3m3,3m4,3t3,3t4,3t5,3t2,4m1,4m2,4m3,4m4,4t2,4t3,4t4,4t5,5m1,5m2,5m3,5m4,5t2,5t3,5t4,5t5,6m1,6m2,6m3,6m4,6t2,6t3,6t4,6t5	FGA-I9,FGA-S1,FGA-S2,FGA-S3,FGA-S4,FGA-S9	4	90
27	FGA0142 - FUNDAMENTOS DE ARQUITETURA DE COMPUTADORES - Turma 2	JOHN LENON CARDOSO GARDENGHI	2 2	Software	0	2m1,2m2,2m3,2m4,2t2,2t3,2t4,2t5,3m1,3m2,3m3,3m4,3t2,3t3,3t4,3t5,4m1,4m2,4m3,4m4,4t2,4t3,4t4,4t5,5m1,5m2,5m3,5m4,5t2,5t3,5t4,5t5,6m1,6m2,6m3,6m4,6t2,6t3,6t4,6t5	FGA-I9,FGA-S1,FGA-S2,FGA-S3,FGA-S4,FGA-S9	4	110
30	FGA0147 - ESTRUTURA DE DADOS E ALGORITMOS - Turma 3	ROSE YURI SHIMIZU	2 2	Software	0	2m1,2m2,2m3,2m4,2t2,2t3,2t4,2t5,3m1,3m2,3m3,3m4,3t2,3t3,3t4,3t5,4m1,4m2,4m3,4m4,4t2,4t3,4t4,4t5,5m1,5m2,5m3,5m4,5t2,5t3,5t4,5t5,6m1,6m2,6m3,6m4,6t2,6t3,6t4,6t5	FGA-I9,FGA-S1,FGA-S2,FGA-S3,FGA-S4,FGA-S9	3	90
31	FGA0158 - ORIENTAÇÃO A OBJETOS - Turma 1	ANDRE LUIZ PERON MARTINS LANNA	2 2	Software	0	2m1,2m2,2m3,2m4,2t2,2t3,2t4,2t5,3m1,3m2,3m3,3m4,3t2,3t3,3t4,3t5,4m1,4m2,4m3,4m4,4t2,4t3,4t4,4t5,5m1,5m2,5m3,5m4,5t2,5t3,5t4,5t5,6m1,6m2,6m3,6m4,6t2,6t3,6t4,6t5	FGA-I2,FGA-I3,FGA-I9,FGA-I10,FGA-S1,FGA-S3,FGA-S2,FGA-S4,FGA-S6,FGA-S7,FGA-S9,FGA-S10	3	48
35	FGA0170 - FUNDAMENTOS DE SISTEMAS OPERACIONAIS - Turma 1	TIAGO ALVES DA FONSECA	2 2	Software	0	2m1,2m2,2m3,2m4,2t2,2t3,2t4,2t5,3m1,3m2,3m3,3m4,3t2,3t3,3t4,3t5,4m1,4m2,4m3,4m4,4t2,4t3,4t4,4t5,5m1,5m2,5m3,5m4,5t2,5t3,5t4,5t5,6m1,6m2,6m3,6m4,6t2,6t3,6t4,6t5	FGA-I9,FGA-S1,FGA-S2,FGA-S3,FGA-S4,FGA-S9	5	110
32	FGA0158 - ORIENTAÇÃO A OBJETOS - Turma 2	FABIANA FREITAS MENDES	2 2	Software	0	2m1,2m2,2m3,2m4,2m5,2t1,2t2,2t3,2t4,2t5,3m1,3m2,3m3,3m4,3m5,3t1,3t2,3t3,3t4,3t5,4m1,4m2,4m3,4m4,4m5,4t1,4t2,4t3,4t4,4t5,5m1,5m2,5m3,5m4,5m5,5t1,5t2,5t3,5t4,5t5,6m1,6m2,6m3,6m4,6m5,6t1,6t2,6t3,6t4,6t5	FGA-I9,FGA-I10,FGA-S1,FGA-S2,FGA-S3,FGA-S4,FGA-S9,FGA-S10	1	80
36	FGA0170 - FUNDAMENTOS DE SISTEMAS OPERACIONAIS - Turma 2	DANIEL SUNDFELD LIMA	2 2	Software	0	2m1,2m2,2m3,2m4,2t2,2t3,2t4,2t5,3m1,3m2,3m3,3m4,3t2,3t3,3t4,3t5,4m1,4m2,4m3,4m4,4t2,4t3,4t4,4t5,5m1,5m2,5m3,5m4,5t2,5t3,5t4,5t5,6m1,6m2,6m3,6m4,6t2,6t3,6t4,6t5	FGA-I9,FGA-S1,FGA-S2,FGA-S3,FGA-S4,FGA-S9	5	110
33	FGA0158 - ORIENTAÇÃO A OBJETOS - Turma 3	FABIANA FREITAS MENDES	2 2	Software	0	2m1,2m2,2m3,2m4,2t2,2t3,2t4,2t5,3m1,3m2,3m3,3m4,3t2,3t3,3t4,3t5,4m1,4m2,4m3,4m4,4t2,4t3,4t4,4t5,5m1,5m2,5m3,5m4,5t2,5t3,5t4,5t5,6m1,6m2,6m3,6m4,6t2,6t3,6t4,6t5	FGA-I9,FGA-I10,FGA-S1,FGA-S2,FGA-S3,FGA-S4,FGA-S9,FGA-S10	3	80
34	FGA0158 - ORIENTAÇÃO A OBJETOS - Turma 4	HENRIQUE GOMES DE MOURA	2 2	Software	0	2m1,2m2,2m3,2m4,2m5,2t1,2t2,2t3,2t4,2t5,3m2,3m1,3m3,3m4,3m5,3t1,3t2,3t4,3t3,3t5,4m2,4m1,4m3,4m4,4m5,4t1,4t2,4t3,4t4,4t5,5m1,5m2,5m3,5m4,5m5,5t1,5t2,5t5,5t4,5t3,6m1,6m2,6m3,6m4,6m5,6t1,6t2,6t5,6t4,6t3	FGA-I9,FGA-I10,FGA-S1,FGA-S2,FGA-S3,FGA-S4,FGA-S9,FGA-S10	3	80
38	FGA0172 - REQUISITOS DE SOFTWARE - Turma 2	GEORGE MARSICANO CORREA	2 2	Software	0	2m1,2m2,2m3,2m4,2t1,2t2,2t3,2t4,2t5,3m1,3m2,3m3,3m4,3t1,3t2,3t3,3t4,3t5,4m1,4m2,4m3,4m4,4t1,4t2,4t3,4t4,4t5,5m1,5m2,5m3,5m4,5t1,5t2,5t3,5t4,5t5,6m1,6m2,6m3,6m4,6t1,6t2,6t3,6t4,6t5	FGA-I2,FGA-I3,FGA-I9,FGA-I10,FGA-S1,FGA-S2,FGA-S3,FGA-S4,FGA-S6,FGA-S7,FGA-S9,FGA-S10	5	48
37	FGA0172 - REQUISITOS DE SOFTWARE - Turma 1	ANDRE BARROS DE SALES	2 2	Software	0	2m1,2m2,2m3,2m4,2t1,2t2,2t3,2t4,2t5,3m1,3m2,3m3,3m4,3t1,3t2,3t3,3t4,3t5,4m1,4m2,4m3,4m4,4t1,4t2,4t3,4t4,4t5,5m1,5m2,5m3,5m4,5t1,5t2,5t3,5t4,5t5,6m1,6m2,6m3,6m4,6t1,6t2,6t3,6t4,6t5	FGA-I2,FGA-I3,FGA-I9,FGA-I10,FGA-S1,FGA-S2,FGA-S3,FGA-S4,FGA-S6,FGA-S7,FGA-S9,FGA-S10	5	48
39	FGA0173 - INTERAÇÃO HUMANO COMPUTADOR - Turma 1	SERGIO ANTONIO ANDRADE DE FREITAS	2 2	Software	0	2m1,2m3,2m2,2m4,2m5,2t1,2t2,2t3,2t4,2t5,3m1,3m2,3m3,3m4,3m5,3t1,3t2,3t4,3t3,3t5,4m1,4m3,4m2,4m4,4m5,4t1,4t2,4t3,4t4,4t5,5m1,5m2,5m3,5m4,5m5,5t1,5t2,5t3,5t4,5t5,6m1,6m3,6m2,6m4,6m5,6t1,6t2,6t3,6t4,6t5	FGA-I2,FGA-I3,FGA-I9,FGA-I10,FGA-S1,FGA-S2,FGA-S3,FGA-S4,FGA-S6,FGA-S7,FGA-S9,FGA-S10	5	60
21	FGA0137 - SISTEMAS DE BANCO DE DADOS 1 - Turma 2	MAURICIO SERRANO	2 2	Software	0	2m1,2m2,2m3,2m4,2t3,2t4,2t5,2t2,3m1,3m2,3m3,3m4,3t2,3t3,3t4,3t5,4m1,4m2,4m3,4m4,4t2,4t3,4t4,4t5,5m1,5m2,5m3,5m4,5t2,5t3,5t4,5t5,6m1,6m2,6m3,6m4,6t3,6t4,6t5,6t2	FGA-I2,FGA-I3,FGA-I9,FGA-I10,FGA-S1,FGA-S2,FGA-S3,FGA-S4,FGA-S6,FGA-S7,FGA-S9,FGA-S10	5	49
48	FGA0242 - TÉCNICAS DE PROGRAMAÇÃO EM PLATAFORMAS EMERGENTES	ANDRE LUIZ PERON MARTINS LANNA	2 2	Software	0	2m1,2m2,2m3,2m4,2t2,2t3,2t4,2t5,3m1,3m2,3m3,3m4,3t2,3t3,3t4,3t5,4m1,4m2,4m3,4m4,4t2,4t3,4t4,4t5,5m1,5m2,5m4,5m3,5t2,5t3,5t4,5t5,6m1,6m2,6m3,6m4,6t2,6t3,6t4,6t5	FGA-I1 ,FGA-I2,FGA-I3,FGA-I4,FGA-I5,FGA-I8,FGA-I9,FGA-I10,FGA-S1,FGA-S2,FGA-S3,FGA-S4,FGA-S5,FGA-S6,FGA-S7,FGA-S8,FGA-S9,FGA-S10,FGA-LAB MOCAP	7	45
41	FGA0208 - ARQUITETURA E DESENHO DE SOFTWARE	MILENE SERRANO (60h)	2 2	Software	0	2m1,2m2,2m3,2m4,2t2,2t3,2t4,2t5,3m1,3m2,3m3,3m4,3t2,3t3,3t4,3t5,4m1,4m2,4m4,4m3,4t2,4t3,4t4,4t5,5m1,5m2,5m3,5m4,5t2,5t4,5t3,5t5,6m1,6m2,6m3,6m4,6t2,6t3,6t4,6t5	FGA-I9,FGA-I10,FGA-S1,FGA-S2,FGA-S3,FGA-S4,FGA-S9,FGA-S10	6	65
42	FGA0210 - PARADIGMAS DE PROGRAMAÇÃO	MILENE SERRANO	2 2	Software	0	2m1,2m2,2m3,2m4,2t2,2t3,2t4,2t5,3m1,3m2,3m3,3m4,3t3,3t4,3t5,3t2,4m1,4m2,4m3,4m4,4t2,4t3,4t4,4t5,5m1,5m2,5m3,5m4,5t2,5t3,5t4,5t5,6m1,6m2,6m3,6m4,6t2,6t3,6t4,6t5	FGA-I1 ,FGA-I2,FGA-I3,FGA-I4,FGA-I5,FGA-I8,FGA-I9,FGA-I10,FGA-S1,FGA-S2,FGA-S3,FGA-S4,FGA-S6,FGA-S5,FGA-S7,FGA-S8,FGA-S9,FGA-S10,FGA-LAB MOCAP	7	45
20	FGA0137 - SISTEMAS DE BANCO DE DADOS 1 - Turma 1	VANDOR ROBERTO VILARDI RISSOLI	2 2	Software	0	2m1,2m2,2m3,2m4,2m5,2t1,2t2,2t3,2t4,2t5,3m1,3m2,3m3,3m4,3m5,3t1,3t2,3t3,3t4,3t5,4m1,4m2,4m3,4m4,4m5,4t1,4t2,4t3,4t4,4t5,5m1,5m2,5m3,5m4,5m5,5t1,5t2,5t3,5t4,5t5,6m1,6m2,6m3,6m4,6m5,6t1,6t2,6t3,6t4,6t5	FGA-I9,FGA-I10,FGA-S1,FGA-S2,FGA-S3,FGA-S4,FGA-S9,FGA-S10	5	80
43	FGA0211 - FUNDAMENTOS DE REDES DE COMPUTADORES	FERNANDO WILLIAM CRUZ	2 2	Software	0	2m1,2m2,2m3,2m4,2t2,2t3,2t5,2t4,3m1,3m2,3m3,3m4,3t2,3t3,3t4,3t5,4m1,4m2,4m4,4m3,4t2,4t3,4t4,4t5,5m1,5m2,5m3,5m4,5t2,5t3,5t4,5t5,6m1,6m2,6m4,6m3,6t2,6t3,6t4,6t5	FGA-I9,FGA-I10,FGA-S1,FGA-S3,FGA-S2,FGA-S4,FGA-S9,FGA-S10	6	70
44	FGA0221 - INTELIGÊNCIA ARTIFICIAL	FABIANO ARAUJO SOARES	2 2	Software	0	2m1,2m2,2m3,2m4,2t2,2t3,2t4,2t5,3m1,3m2,3m3,3m4,3t2,3t3,3t4,3t5,4m1,4m2,4m3,4m4,4t2,4t3,4t4,4t5,5m1,5m2,5m3,5m4,5t2,5t3,5t4,5t5,6m1,6m2,6m3,6m4,6t2,6t3,6t4,6t5	FGA-I1 ,FGA-LAB MOCAP,FGA-I2,FGA-I3,FGA-I4,FGA-I5,FGA-I8,FGA-I9,FGA-I10,FGA-S1,FGA-S2,FGA-S3,FGA-S4,FGA-S5,FGA-S6,FGA-S7,FGA-S8,FGA-S9,FGA-S10	10	45
45	FGA0238 - TESTES DE SOFTWARE - Turma 1	ELAINE VENSON	2 2	Software	0	2m1,2m3,2m4,2m2,2t2,2t3,2t4,2t5,3m1,3m2,3m3,3m4,3t2,3t3,3t4,3t5,4m1,4m4,4m3,4m2,4t2,4t3,4t4,4t5,5m1,5m2,5m3,5m4,5t2,5t3,5t5,5t4,6m1,6m2,6m3,6m4,6t2,6t3,6t4,6t5	FGA-I9,FGA-I10,FGA-S1,FGA-S2,FGA-S4,FGA-S3,FGA-S9,FGA-S10	10	80
46	FGA0238 - TESTES DE SOFTWARE - Turma 2	ELAINE VENSON	2 2	Software	0	2m1,2m2,2m4,2m3,2t2,2t3,2t4,2t5,3m1,3m2,3m3,3m4,3t3,3t2,3t4,3t5,4m2,4m1,4m3,4m4,4t2,4t3,4t4,4t5,5m1,5m2,5m4,5m3,5t3,5t2,5t4,5t5,6m1,6m2,6m3,6m4,6t3,6t2,6t4,6t5	FGA-I9,FGA-I10,FGA-S1,FGA-S2,FGA-S3,FGA-S4,FGA-S9,FGA-S10	10	80
47	FGA0240 - GERÊNCIA DE CONFIGURAÇÃO E EVOLUÇÃO DE SOFTWARE	RENATO CORAL SAMPAIO	2 2	Software	0	2m1,2m2,2m3,2m4,2t2,2t3,2t4,2t5,3m1,3m2,3m3,3m4,3t2,3t4,3t5,3t3,4m1,4m2,4m3,4m4,4t3,4t2,4t4,4t5,5m1,5m2,5m3,5m4,5t2,5t3,5t4,5t5,6m1,6m2,6m3,6m4,6t2,6t3,6t4,6t5	FGA-I9,FGA-I10,FGA-S1,FGA-S2,FGA-S3,FGA-S4,FGA-S9,FGA-S10	8	70
49	FGA0244 - PROGRAMAÇÃO PARA SISTEMAS PARALELOS E DISTRIBUÍDOS	FERNANDO WILLIAM CRUZ	2 2	Software	0	2m1,2m2,2m3,2m4,2t2,2t3,2t4,2t5,3m1,3m2,3m3,3m4,3t2,3t3,3t4,3t5,4m1,4m2,4m3,4m4,4t2,4t3,4t4,4t5,5m1,5m2,5m3,5m4,5t2,5t3,5t4,5t5,6m1,6m2,6m3,6m4,6t2,6t3,6t4,6t5	FGA-I2,FGA-I3,FGA-I9,FGA-I10,FGA-S1,FGA-S2,FGA-S3,FGA-S4,FGA-S6,FGA-S7,FGA-S9,FGA-S10	7	60
50	FGA0275 - ENGENHARIA DE SOFTWARE EXPERIMENTAL	REJANE MARIA DA COSTA FIGUEIREDO	2 2	Software	0	2m1,2m2,2m4,2m3,2t2,2t3,2t4,2t5,3m1,3m2,3m3,3m4,3t2,3t3,3t4,3t5,4m1,4m2,4m3,4m4,4t2,4t3,4t4,4t5,5m1,5m2,5m3,5m4,5t2,5t3,5t4,5t5,6m1,6m2,6m3,6m4,6t2,6t3,6t4,6t5	FGA-I2,FGA-I3,FGA-I9,FGA-LAB MOCAP,FGA-I10,FGA-S1,FGA-S2,FGA-S3,FGA-S4,FGA-S6,FGA-S7,FGA-S9,FGA-S10	10	49
51	FGA0278 - QUALIDADE DE SOFTWARE 1 - Turma 1	CRISTIANE SOARES RAMOS	2 2	Software	0	2m1,2m2,2m3,2m4,2t2,2t3,2t4,2t5,3m1,3m2,3m3,3m4,3t2,3t3,3t4,3t5,4m1,4m2,4m3,4m4,4t2,4t3,4t4,4t5,5m1,5m2,5m3,5m4,5t2,5t3,5t4,5t5,6m1,6m2,6m3,6m4,6t2,6t3,6t4,6t5	FGA-I2,FGA-I3,FGA-I9,FGA-S1,FGA-I10,FGA-S2,FGA-S3,FGA-S4,FGA-S6,FGA-S7,FGA-S9,FGA-S10,FGA-LAB MOCAP	6	49
52	FGA0278 - QUALIDADE DE SOFTWARE 1 - Turma 2	CRISTIANE SOARES RAMOS	2 2	Software	0	2m1,2m2,2m3,2m4,2t2,2t3,2t4,2t5,3m1,3m2,3m3,3m4,3t2,3t3,3t4,3t5,4m1,4m2,4m3,4m4,4t2,4t3,4t4,4t5,5m1,5m2,5m3,5m4,5t2,5t3,5t4,5t5,6m1,6m2,6m4,6m3,6t2,6t3,6t4,6t5	FGA-I2,FGA-I3,FGA-I9,FGA-I10,FGA-S1,FGA-S2,FGA-S3,FGA-S4,FGA-S6,FGA-S7,FGA-S9,FGA-S10,FGA-LAB MOCAP	6	49
40	FGA0173 - INTERAÇÃO HUMANO COMPUTADOR - Turma 2	ANDRE BARROS DE SALES 	2 2	Software	0	2m1,2m2,2m3,2m4,2t2,2t3,2t4,2t5,3m1,3m2,3m3,3m4,3t2,3t3,3t4,3t5,4m1,4m2,4m3,4m4,4t2,4t3,4t4,4t5,5m1,5m2,5m3,5m4,5t2,5t3,5t4,5t5,6m1,6m2,6m3,6m4,6t2,6t3,6t4,6t5	FGA-I2,FGA-I3,FGA-I9,FGA-I10,FGA-S1,FGA-S2,FGA-S3,FGA-S4,FGA-S6,FGA-S7,FGA-S9,FGA-S10	5	60
\.


--
-- Name: account_id_seq; Type: SEQUENCE SET; Schema: public; Owner: me
--

SELECT pg_catalog.setval('public.account_id_seq', 1, true);


--
-- Name: classroom_id_seq; Type: SEQUENCE SET; Schema: public; Owner: me
--

SELECT pg_catalog.setval('public.classroom_id_seq', 26, true);


--
-- Name: course_id_seq; Type: SEQUENCE SET; Schema: public; Owner: me
--

SELECT pg_catalog.setval('public.course_id_seq', 52, true);


--
-- Name: account account_email_key; Type: CONSTRAINT; Schema: public; Owner: me
--

ALTER TABLE ONLY public.account
    ADD CONSTRAINT account_email_key UNIQUE (email);


--
-- Name: account account_pkey; Type: CONSTRAINT; Schema: public; Owner: me
--

ALTER TABLE ONLY public.account
    ADD CONSTRAINT account_pkey PRIMARY KEY (id);


--
-- Name: classroom classroom_pkey; Type: CONSTRAINT; Schema: public; Owner: me
--

ALTER TABLE ONLY public.classroom
    ADD CONSTRAINT classroom_pkey PRIMARY KEY (id);


--
-- Name: course course_name_key; Type: CONSTRAINT; Schema: public; Owner: me
--

ALTER TABLE ONLY public.course
    ADD CONSTRAINT course_name_key UNIQUE (name);


--
-- Name: course course_pkey; Type: CONSTRAINT; Schema: public; Owner: me
--

ALTER TABLE ONLY public.course
    ADD CONSTRAINT course_pkey PRIMARY KEY (id);


--
-- PostgreSQL database dump complete
--
