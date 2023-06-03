import React from 'react';
import './App.css';
import {PokemonComponent} from "./page/content";
import {QueryClient, QueryClientProvider} from "react-query";

const queryClient = new QueryClient()

export const App: React.FC = () => {
    {
        return (
            <div className="App">
                <QueryClientProvider client={queryClient}>
                    <PokemonComponent/>
                </QueryClientProvider>
            </div>
        );
    }
}
