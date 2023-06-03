import React, {useEffect, useMemo, useState} from "react";
import {Col, Layout, RadioChangeEvent, Row, theme} from 'antd';
import {Radio, Space} from 'antd';
import './content.css';
import {useQuery, useQueryClient} from "react-query";
import {JSX} from "react/jsx-runtime";
import _ from "lodash";
import {Pokemon, PokemonDetail} from "../model/pokemon";

const {Content} = Layout;

type PokemonSort = "Name" | "ID"
export const PokemonComponent: React.FC = () => {
    const queryKey = "pokemons"
    const {
        token: {colorBgContainer},
    } = theme.useToken();

    const queryClient = useQueryClient()

    const [sortType, setSortType] = useState<PokemonSort>("ID")

    const [offset, setOffset] = useState<number>(0)

    const displayPerPage = 12

    const displayPerRow = 4

    const {isLoading, error, data} = useQuery([queryKey, offset], () =>
        fetch(`https://pokeapi.co/api/v2/pokemon?limit=12&offset=${offset * displayPerPage}`).then(async res => {
                const r = await res.json()
                const pokemonList = r.results as Pokemon[]
                const mapImage =
                    await Promise.all(pokemonList.map(async p => {
                        const detail = await getImage(p.url)
                        return {...p, detail: detail}
                    }))

                return mapImage as Pokemon[]
            }
        )
    )

    const getImage = (url: string) => {
        if (url) {
            return fetch(url).then(async res => {
                    const r = await res.json()
                    return r as PokemonDetail
                }
            )
        } else {
            return null
        }
    }

    const displayData: Pokemon[] | undefined = useMemo(() => {
        if (data && sortType) {
            console.log(data)
            switch (sortType) {
                case  "ID":
                    return _.sortBy(data, "id");
                case "Name":
                    return _.sortBy(data, "name");
            }
        } else {
            return data
        }
    }, [data, sortType])


    useEffect(() => {
        queryClient.invalidateQueries([queryKey, offset])
    }, [offset])

    const onOffsetNext = (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
        event.preventDefault()
        setOffset(o => o + 1)
    }

    const onOffsetPrevious = (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
        event.preventDefault()
        setOffset(o => {
            if (o > 1) {
                return o - 1
            } else {
                return o
            }
        })
    }


    const onSortTypeChange = (e: RadioChangeEvent) => {
        setSortType(e.target.value);
    };

    const PokemonBox = (pokemon: Pokemon) => {
        return (
            <Col span={6}>
                <div className={"pokemons"} style={{marginTop: "20px"}}>
                    <div className="space-align-container">
                        <div className="space-align-block">
                            <Space align="center">
                                <span className="mock-block" style={{height: "110px", width: "110px"}}><img
                                    src={pokemon.detail.sprites.back_default} alt={pokemon.name}/></span>
                                {pokemon.name}
                            </Space>
                        </div>
                    </div>
                </div>
            </Col>)
    }

    const PokemonDisplay = () => {
        let rows: JSX.Element[] = [];
        let boxes: JSX.Element[] = [];
        if (displayData) {
            displayData.map((p, index) => {
                if (index % displayPerRow == 0 && index != 0) {
                    rows.push(<Row>{boxes}</Row>)
                    boxes = [];
                    boxes.push(PokemonBox(p));
                } else {
                    boxes.push(PokemonBox(p));
                }
            })
            if (boxes.length > 0) {
                rows.push(<Row>{boxes}</Row>)
            }

            return (
                rows
            )
        } else if (isLoading) {
            return <h1>Loading...</h1>
        } else {
            return <></>
        }

    }


    return (
        <div style={{padding: '0 50px', height: '100%'}}>
            <Layout className="layout">

                <Content style={{padding: '50px 50px'}}>
                    <div className="site-layout-content"
                         style={{background: colorBgContainer, textAlign: "justify", padding: "20px"}}>
                        <div className={"title"}>
                            <Row>
                                <Col span={16}><b>All the Pokemon!</b></Col>
                                <Col span={8} style={{textAlign: "right"}}>
                                    <Radio.Group onChange={onSortTypeChange} value={sortType}>
                                        <Space>
                                            <Radio value={"Name"}>Sort Name</Radio>
                                            <Radio value={"ID"}>Sort ID</Radio>
                                        </Space>
                                    </Radio.Group></Col>
                            </Row>
                            {PokemonDisplay()}

                            <div className={"footer"}>
                                <Row>
                                    <Col span={12}><a onClick={onOffsetPrevious}>Previous 12</a></Col>
                                    <Col span={12} style={{textAlign: "right", paddingRight: "5px"}}>
                                        <a onClick={onOffsetNext}>Next 12 </a>
                                    </Col>
                                </Row>
                            </div>

                        </div>

                    </div>
                </Content>
            </Layout>
        </div>

    )
}
