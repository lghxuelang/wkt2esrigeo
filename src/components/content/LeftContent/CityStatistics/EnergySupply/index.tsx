import React, { useState } from 'react';
import { DatePicker } from 'antd';
import TitlePanel from '@/components/containers/titlePanel';
import imgSrc from './images/back.png';
import styles from './index.less';
import ElectricStation from './components/ElectricStation';
import WaterStation from './components/WaterStation';
import GasStation from './components/GasStation';
import HeatStation from './components/HeatStation';

interface EnergySupplyPropTypes {
    backUp: Function
}

const EnergySupply: React.FC<EnergySupplyPropTypes> = ({ backUp }) => {
    const [activeToolbar, setActiveToolbar] = useState('electric');

    const renderContent = () => {
        switch (activeToolbar) {
            case 'electric': {
                return <ElectricStation />;
            }
            case 'water': {
                return <WaterStation />;
            }
            case 'gas': {
                return <GasStation />;
            }
            case 'heat': {
                return <HeatStation />;
            }
            default:
                break;
        }
        return <div></div>;
    };


    const changeToolbarActive = e => {
        setActiveToolbar(e.currentTarget.dataset.btn);
    };

    return (
        <TitlePanel
            title={<div className={styles.titleWrap} ><img alt="" src={imgSrc} onClick={() => {
                backUp('cityGeneral')
            }}/>能源运行</div>}
            className={styles.energySupply}
        >
            <div className={styles.content}>
                <div className={styles['guide']}>
                    <span
                        className={[styles.item, activeToolbar === 'electric' ? styles.active : ''].join(' ')}
                        data-btn="electric"
                        onClick={changeToolbarActive}
                    >
                        <span>电力站点</span>
                        <span>22</span>
                    </span>
                    <span
                        className={[styles.item, activeToolbar === 'water' ? styles.active : ''].join(' ')}
                        data-btn="water"
                        onClick={changeToolbarActive}
                    >
                        <span>供水站点</span>
                        <span>22</span>
                    </span>
                    <span
                        className={[styles.item, activeToolbar === 'gas' ? styles.active : ''].join(' ')}
                        data-btn="gas"
                        onClick={changeToolbarActive}>
                        <span>燃气站点</span>
                        <span>125</span>
                    </span>
                    <span
                        className={[styles.item, activeToolbar === 'heat' ? styles.active : ''].join(' ')}
                        data-btn="heat"
                        onClick={changeToolbarActive}>
                        <span>供热站点</span>
                        <span>15，652</span>
                    </span>
                </div>

                <div className={styles.contentDiv}>{renderContent()}</div>

            </div>
        </TitlePanel>
    );
};

export default EnergySupply;
