import React, { useEffect, useState } from "react";
import "./FlowChart.css";
import HighchartsReact from "highcharts-react-official";
import Highcharts from "highcharts";
import highchartsDrilldown from "highcharts/modules/drilldown";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid2";
import Container from "@mui/material/Container";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import InputLabel from "@mui/material/InputLabel";
import ListItemText from "@mui/material/ListItemText";
import MenuItem from "@mui/material/MenuItem";
import Checkbox from "@mui/material/Checkbox";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import Typography from "@mui/material/Typography";
import {chartOptions} from './helpers';
import {productList} from './productList';
import {list} from './list';

const FlowChart:React.FC = () => {
  const [category, setCategory] = useState<string>("");
  const [product, setProduct] = useState<string[]>([]);
  const [listProduct, setListProduct] = useState<productList[]>([]);
  const [listCategory, setListCategory] = useState<string[]>([]);
  const [spinner, setSpinner] = useState<boolean>(true);
  const [getList, setList] = useState<list[]>([]);
  const [displayList, setDisplayList] = useState<productList[]>([]);

  const handleChange = (event: SelectChangeEvent) => {
    setCategory(event.target.value as string);
  };

  const onClearHandler=():void=>{
   setSpinner(true);
   setCategory('');
   setDisplayList([]);
   setProduct([]);
   setListProduct([]);
  }

  useEffect(() => {
    let result = getList
      .filter((data: list) => {
        return data.category === category;
      })
      .map((data: list) => {
        return {
          name: data.brand?data.brand:data.title,
          y: data.dimensions.height,
          drilldown: data.brand?data.brand:data.title,
        };
      });
    setListProduct(result);
    setProduct([]);
  }, [category]);

  const handleProductChange = (event:any) => {
    setProduct(event.target.value as []);
  };

  const onReportHandler = () => {
    setSpinner(true);
    const result: productList[] = [];
    for (let input of product) {
     let data = listProduct.find((obj) => obj.name === input);
     if(data){
      result.push(data);
     }  
    }
    setDisplayList(result);
    setTimeout(() => {
      setSpinner(false);
    }, 3000);
  };

  useEffect(() => {
    fetch("https://dummyjson.com/products")
      .then((response) => response.json())
      .then((result) => {
        setList(result.products);
        let dummy: string[] = [];
        result.products.map((result: any) => {
          let index = dummy.findIndex(
            (selections) => selections === result.category
          );
          if (index === -1) {
            dummy.push(result.category);
          }
        });
        setListCategory(dummy);
      });
  }, []);



  return (
    <div className="layout">
      <Container>
        <Box sx={{ flexGrow: 1 }}>
          <Grid container spacing={2}>
            <Grid size={4}>
              <Card sx={{ minWidth: 275 }}>
                <CardContent>
                  <Grid container spacing={2}>
                    <Grid size={10}>
                      <Typography variant="h5" component="h2">
                        Filter
                      </Typography>
                    </Grid>
                    <Grid size={2}>
                      <Typography variant="h6" component="h6">
                        <span onClick={onClearHandler}>clear</span>
                      </Typography>
                    </Grid>
                  </Grid>

                  <div className="box-selection">
                    <Box sx={{ minWidth: 120 }}>
                      <FormControl fullWidth>
                        <InputLabel id="demo-simple-select-label">
                          Category
                        </InputLabel>
                        <Select
                          labelId="demo-simple-select-label"
                          id="demo-simple-select"
                          value={category}
                          label="category"
                          onChange={handleChange}
                        >
                          <MenuItem value="">
                            <em>Choose a Category</em>
                          </MenuItem>
                          {listCategory.map((make, index) => (
                            <MenuItem key={index} value={make}>
                              {make}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Box>
                  </div>
                  <div className="box-selection">
                    <Box sx={{ minWidth: 120 }} margin="dense">
                      <FormControl fullWidth>
                        <InputLabel id="demo-simple-select-label">
                          Product
                        </InputLabel>
                        <Select
                          labelId="demo-simple-select-label"
                          id="demo-simple-select"
                          multiple
                          value={product}
                          label="product"
                          onChange={handleProductChange}
                        >
                          {listProduct.map((make, index) => (
                            <MenuItem key={index} value={make.name}>
                              <Checkbox checked={product.includes(make.name)} />
                              <ListItemText primary={make.name} />
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Box>
                  </div>
                  <div className="box-selection">
                    <Button variant="contained" onClick={onReportHandler}>
                      Report
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </Grid>
            <Grid size={8}>
              {spinner && displayList.length > 0 && (
                <Box display="flex"
                justifyContent="center"
                alignItems="center"
                minHeight="10vh">
                  <CircularProgress />
                </Box>
              )}
              {!spinner && (
                <HighchartsReact
                  highcharts={highchartsDrilldown(Highcharts)}
                  options={chartOptions(displayList)}
                />
              )}
            </Grid>
          </Grid>
        </Box>
      </Container>
    </div>
  );
};

export default FlowChart;
