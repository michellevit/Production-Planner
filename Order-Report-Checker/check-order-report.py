import os
import openpyxl


order_dict = {}


class Order:
    def __init__(
        self,
        order_number,
        ship_date,
        item_type_dict,
        item_subtype_dict,
        customer_name,
        dimensions,
        weight,
        confirmed=False,
        archived=False,
    ):
        self.order_number = order_number
        self.ship_date = ship_date
        self.item_type_dict = {}
        self.item_subtype_dict = {}
        self.customer_name = customer_name
        self.dimensions = dimensions
        self.weight = weight
        self.confirmed = confirmed
        self.archived = archived


def find_workbooks():
    current_directory = os.getcwd()
    files_in_directory = os.listdir(current_directory)
    xlsx_files = [file for file in files_in_directory if file.endswith(".xlsx")]
    if not xlsx_files:
        print("There are no excel workbooks in this directory.")
    else:
        for file in xlsx_files:
            no_files = False
            no_files = check_if_correct_workbook(file)
        if no_files:
            print(
                "There are no QuickBooks Order Reports which are compatible with this program (in this directory)."
            )


def check_if_correct_workbook(file):
    script_directory = os.path.dirname(os.path.abspath(__file__))
    workbook_path = os.path.join(script_directory, file)
    workbook = openpyxl.load_workbook(workbook_path)
    sheet = workbook["Sheet1"]
    cell_value = sheet["B2"].value
    if cell_value != "Assembly":
        no_files = True
        return no_files
    else:
        sort_workbook(sheet)


def sort_workbook(sheet):
    for index, row in enumerate(sheet.iter_rows(min_row=0, min_col=3, max_col=12)):
        item_type = row[0].value
        item_subtype = None
        if item_type is None:
            continue
        elif "Total" in item_type:
            continue
        elif "Ship" in item_type:
            continue
        elif "Return" in item_type:
            continue
        else:
            next_row_number = index + 2
            for next_row in sheet.iter_rows(
                min_row=next_row_number, min_col=3, max_col=12
            ):
                if next_row[1].value != None and "Total" not in next_row[1].value:
                    item_subtype = next_row[1].value
                if item_subtype == item_type + " - Other":
                    item_subtype = item_type
                if next_row[2].value == None:
                    continue
                else:
                    item_type_dict = {item_type: next_row[8].value}
                    if item_subtype != None:
                        item_subtype_dict = {item_subtype: next_row[8].value}
                    else:
                        item_subtype_dict = {item_type: next_row[8].value}
                    new_object = {
                        "order_number": next_row[4].value,
                        "ship_date": next_row[2].value,
                        "item_type_dict": item_type_dict,
                        "item_subtype_dict": item_subtype_dict,
                        "customer_name": next_row[6].value,
                        "dimensions": None,
                        "weight": None,
                        "confirmed": False,
                        "archived": False,
                    }
                    order_dict[next_row[4].value] = new_object

    for key, value in order_dict.items():
        print(
            "Order Number: ",
            value["order_number"],
            "\n",
            "Ship Date: ",
            value["ship_date"],
            "\n",
            "Customer Name: ",
            value["customer_name"],
            "\n",
            "Item Type: ",
            value["item_type_dict"],
            "\n",
            "Item Subtype: ",
            value["item_subtype_dict"],
            "\n",
            "Dimensions: ",
            value["dimensions"],
            "\n",
            "Weight: ",
            value["weight"],
            "\n",
            "Confirmed: ",
            value["confirmed"],
            "\n",
            "Archived: ",
            value["archived"],
            "\n",
            "\n\n",
        )


find_workbooks()
